import { ref } from 'vue'

interface User {
  id: string
  email: string
  emailVerified: boolean
  role: string
  createdAt: string
  profile?: {
    fullName: string
    phone: string
    city: string
  } | null
}

interface Application {
  id: string
  userId: string
  category: 'starter' | 'active' | 'it'
  summary: string
  planFilePath: string | null
  videoFilePath: string | null
  status: 'draft' | 'submitted'
  createdAt: string
  updatedAt: string
  user?: {
    email: string
    profile?: {
      fullName: string
      phone: string
      city: string
    } | null
  }
}

interface Contact {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

interface ApplicationStats {
  total: number
  totalUsers: number
  totalContacts: number
  byStatus: {
    draft?: number
    submitted?: number
  }
  byCategory: {
    starter?: number
    active?: number
    it?: number
  }
  registrationsByDay: {
    date: string
    count: number
  }[]
  contactsByDay: {
    date: string
    count: number
  }[]
}

interface GetApplicationsParams {
  status?: 'draft' | 'submitted'
  category?: 'starter' | 'active' | 'it'
  page?: number
  limit?: number
}

interface GetApplicationsResponse {
  applications: Application[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface GetContactsParams {
  page?: number
  limit?: number
}

interface GetUsersParams {
  page?: number
  limit?: number
  role?: 'user' | 'admin'
  search?: string
  emailVerified?: boolean
}

interface GetContactsResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useAdmin = () => {
  const { fetchWithAuth } = useAuth()
  const config = useRuntimeConfig()

  const applications = ref<Application[]>([])
  const users = ref<User[]>([])
  const contacts = ref<Contact[]>([])
  const stats = ref<ApplicationStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get all applications with optional filters
   */
  const getAllApplications = async (params?: GetApplicationsParams) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())

      const queryString = queryParams.toString()
      const url = `${config.public.apiUrl}/admin/applications${queryString ? `?${queryString}` : ''}`

      const response = await fetchWithAuth<{ success: boolean; data: GetApplicationsResponse }>(url)
      applications.value = response.data.applications
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch applications'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update application status
   */
  const updateApplicationStatus = async (
    applicationId: string,
    status: 'draft' | 'submitted'
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: Application }>(
        `${config.public.apiUrl}/admin/applications/${applicationId}/status`,
        {
          method: 'PUT',
          body: { status },
        }
      )

      // Update local state
      const index = applications.value.findIndex((app) => app.id === applicationId)
      if (index !== -1) {
        applications.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update application status'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all users with optional filters
   */
  const getAllUsers = async (params?: GetUsersParams) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.role) queryParams.append('role', params.role)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.emailVerified !== undefined) queryParams.append('emailVerified', params.emailVerified.toString())

      const queryString = queryParams.toString()
      const url = `${config.public.apiUrl}/admin/users${queryString ? `?${queryString}` : ''}`

      const response = await fetchWithAuth<{
        success: boolean;
        data: {
          users: User[];
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          }
        }
      }>(url)
      users.value = response.data.users
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get application statistics
   */
  const getStats = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: ApplicationStats }>(
        `${config.public.apiUrl}/admin/stats`
      )
      stats.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch statistics'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all contacts with pagination
   */
  const getAllContacts = async (params?: GetContactsParams) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())

      const queryString = queryParams.toString()
      const url = `${config.public.apiUrl}/admin/contacts${queryString ? `?${queryString}` : ''}`

      const response = await fetchWithAuth<{ success: boolean; data: GetContactsResponse }>(url)
      contacts.value = response.data.contacts
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contacts'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get contact by ID
   */
  const getContactById = async (contactId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: Contact }>(
        `${config.public.apiUrl}/admin/contacts/${contactId}`
      )
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contact'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Export all applications to Excel
   */
  const exportApplications = async () => {
    loading.value = true
    error.value = null

    try {
      const { accessToken } = useAuth()
      const response = await fetch(`${config.public.apiUrl}/admin/applications/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export applications')
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'applications.xlsx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Convert response to blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      error.value = err.message || 'Failed to export applications'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Export all users to Excel
   */
  const exportUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const { accessToken } = useAuth()
      const response = await fetch(`${config.public.apiUrl}/admin/users/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export users')
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'users.xlsx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Convert response to blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      error.value = err.message || 'Failed to export users'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    applications,
    users,
    contacts,
    stats,
    loading,
    error,
    getAllApplications,
    updateApplicationStatus,
    getAllUsers,
    getStats,
    getAllContacts,
    getContactById,
    exportApplications,
    exportUsers,
  }
}
