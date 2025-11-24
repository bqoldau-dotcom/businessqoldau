import { ref } from 'vue'

export type ApplicationCategory = 'starter' | 'active' | 'it'
export type ApplicationStatus = 'draft' | 'submitted' | 'accepted' | 'rejected' | 'revision' | 'withdrawn'

export interface ApplicationFile {
  id: string
  applicationId: string
  filePath: string
  fileName: string
  fileSize: number
  mimeType: string
  fileType: 'document' | 'video' | 'other'
  createdAt: string
}

export interface Application {
  id: string
  userId: string
  category: ApplicationCategory
  summary: string
  planFilePath: string | null
  videoFilePath: string | null
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
  files?: ApplicationFile[]
}

export interface ApplicationInput {
  category: ApplicationCategory
  summary: string
}

export interface ApplicationUpdateInput {
  category?: ApplicationCategory
  summary?: string
}

export interface UploadProgressEvent {
  loaded: number
  total: number
  percentage: number
}

export const useApplication = () => {
  const config = useRuntimeConfig()
  const { fetchWithAuth, getAuthHeaders } = useAuth()

  const applications = useState<Application[]>('applications', () => [])
  const currentApplication = useState<Application | null>('currentApplication', () => null)
  const applicationFiles = useState<ApplicationFile[]>('applicationFiles', () => [])
  const loading = ref(false)
  const uploadProgress = ref(0)
  const uploadingFiles = ref<Map<string, number>>(new Map())
  const error = ref<string | null>(null)

  /**
   * Get all applications for the current user
   */
  const getApplications = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; applications: Application[] }>(
        `${config.public.apiUrl}/applications`
      )

      applications.value = response.applications
      // Set current application to the first one (users can have only one application)
      if (response.applications.length > 0) {
        currentApplication.value = response.applications[0]
      } else {
        currentApplication.value = null
      }
      return response.applications
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch applications'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a specific application by ID
   */
  const getApplicationById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; application: Application }>(
        `${config.public.apiUrl}/applications/${id}`
      )

      currentApplication.value = response.application
      return response.application
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new application (draft status)
   */
  const createApplication = async (data: ApplicationInput) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; application: Application }>(
        `${config.public.apiUrl}/applications`,
        {
          method: 'POST',
          body: data,
        }
      )

      currentApplication.value = response.application
      applications.value.push(response.application)
      return response.application
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to create application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing application (only draft status)
   */
  const updateApplication = async (id: string, data: ApplicationUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; application: Application }>(
        `${config.public.apiUrl}/applications/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      )

      currentApplication.value = response.application

      // Update in the list
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.application
      }

      return response.application
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to update application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an application (only draft status)
   */
  const deleteApplication = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ message: string }>(
        `${config.public.apiUrl}/applications/${id}`,
        {
          method: 'DELETE',
        }
      )

      // Remove from the list
      applications.value = applications.value.filter(app => app.id !== id)

      if (currentApplication.value?.id === id) {
        currentApplication.value = null
      }
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to delete application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Submit an application (change status from draft to submitted)
   */
  const submitApplication = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; application: Application }>(
        `${config.public.apiUrl}/applications/${id}/submit`,
        {
          method: 'POST',
        }
      )

      currentApplication.value = response.application

      // Update in the list
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.application
      }

      return response.application
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to submit application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Withdraw a submitted application (change status from submitted to withdrawn)
   */
  const withdrawApplication = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; application: Application }>(
        `${config.public.apiUrl}/applications/${id}/withdraw`,
        {
          method: 'POST',
        }
      )

      currentApplication.value = response.application

      // Update in the list
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.application
      }

      return response.application
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to withdraw application'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload a file (business plan or video) for an application
   * Uses native fetch with FormData for file upload with progress tracking
   */
  const uploadFile = async (
    id: string,
    file: File,
    onProgress?: (progress: UploadProgressEvent) => void
  ) => {
    loading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      const formData = new FormData()
      formData.append('planFile', file)

      // Use XMLHttpRequest for upload progress tracking
      const response = await new Promise<Application>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100)
            uploadProgress.value = percentage

            if (onProgress) {
              onProgress({
                loaded: event.loaded,
                total: event.total,
                percentage,
              })
            }
          }
        })

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText)
              resolve(data.application)
            } catch (err) {
              reject(new Error('Failed to parse response'))
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.message || 'Upload failed'))
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'))
        })

        // Send request
        const headers = getAuthHeaders()
        xhr.open('POST', `${config.public.apiUrl}/applications/${id}/upload`)

        // Set auth header if available
        if (headers.Authorization) {
          xhr.setRequestHeader('Authorization', headers.Authorization)
        }

        xhr.send(formData)
      })

      currentApplication.value = response

      // Update in the list
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response
      }

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to upload file'
      throw err
    } finally {
      loading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Get all files for a specific application
   */
  const getApplicationFiles = async (applicationId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; files: ApplicationFile[] }>(
        `${config.public.apiUrl}/applications/${applicationId}/files`
      )

      applicationFiles.value = response.files
      return response.files
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch application files'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload multiple files for an application
   * Supports up to 10 files
   */
  const uploadFiles = async (
    applicationId: string,
    files: File[],
    onProgress?: (fileId: string, progress: UploadProgressEvent) => void
  ) => {
    if (files.length === 0) {
      throw new Error('No files selected')
    }

    if (files.length > 10) {
      throw new Error('Maximum 10 files allowed')
    }

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()

      // Append all files to FormData
      files.forEach(file => {
        formData.append('files', file)
      })

      const uploadedFiles = await new Promise<ApplicationFile[]>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100)
            uploadProgress.value = percentage

            if (onProgress) {
              onProgress('batch', {
                loaded: event.loaded,
                total: event.total,
                percentage,
              })
            }
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText)
              resolve(data.files || [])
            } catch (err) {
              reject(new Error('Failed to parse response'))
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.message || 'Upload failed'))
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'))
        })

        const headers = getAuthHeaders()
        xhr.open('POST', `${config.public.apiUrl}/applications/${applicationId}/files/upload`)

        if (headers.Authorization) {
          xhr.setRequestHeader('Authorization', headers.Authorization)
        }

        xhr.send(formData)
      })

      // Refresh application files list
      await getApplicationFiles(applicationId)

      return uploadedFiles
    } catch (err: any) {
      error.value = err?.message || 'Failed to upload files'
      throw err
    } finally {
      loading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Delete a specific file from an application
   */
  const deleteFile = async (applicationId: string, fileId: string) => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ message: string }>(
        `${config.public.apiUrl}/applications/${applicationId}/files/${fileId}`,
        {
          method: 'DELETE',
        }
      )

      // Remove from the list
      applicationFiles.value = applicationFiles.value.filter(file => file.id !== fileId)
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to delete file'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Download a specific file
   */
  const downloadFile = async (applicationId: string, fileId: string) => {
    try {
      const file = applicationFiles.value.find(f => f.id === fileId)
      if (!file) {
        throw new Error('File not found')
      }

      // Create download link
      const downloadUrl = `${config.public.apiUrl}/applications/${applicationId}/files/${fileId}/download`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.fileName
      link.target = '_blank'

      // Add auth header via fetch and create blob URL
      const headers = getAuthHeaders()
      const response = await fetch(downloadUrl, { headers })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      link.href = blobUrl

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (err: any) {
      error.value = err?.message || 'Failed to download file'
      throw err
    }
  }

  return {
    applications,
    currentApplication,
    application: currentApplication, // Alias for single application
    applicationFiles,
    loading,
    uploadProgress,
    uploadingFiles,
    error,
    getApplications,
    fetchApplications: getApplications, // Alias for consistency
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    submitApplication,
    withdrawApplication,
    uploadFile,
    getApplicationFiles,
    uploadFiles,
    deleteFile,
    downloadFile,
  }
}