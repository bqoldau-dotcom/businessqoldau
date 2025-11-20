import { ref } from 'vue'

export type ApplicationCategory = 'starter' | 'active' | 'it'
export type ApplicationStatus = 'draft' | 'submitted'

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
  const loading = ref(false)
  const uploadProgress = ref(0)
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

  return {
    applications,
    currentApplication,
    application: currentApplication, // Alias for single application
    loading,
    uploadProgress,
    error,
    getApplications,
    fetchApplications: getApplications, // Alias for consistency
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    submitApplication,
    uploadFile,
  }
}