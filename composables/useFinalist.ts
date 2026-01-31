import { ref } from 'vue'

export type ApplicationCategory = 'starter' | 'active' | 'it'

export interface Finalist {
  id: string
  fullName: string
  projectName: string
  category: ApplicationCategory
  city: string | null
  photoPath: string | null
  description: string | null
  place: number | null
  isWinner: boolean
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateFinalistData {
  fullName: string
  projectName: string
  category: ApplicationCategory
  city?: string
  description?: string
  place?: number | null
  isWinner?: boolean
  order?: number
  isActive?: boolean
}

export interface UpdateFinalistData {
  fullName?: string
  projectName?: string
  category?: ApplicationCategory
  city?: string | null
  description?: string | null
  place?: number | null
  isWinner?: boolean
  order?: number
  isActive?: boolean
}

export interface FinalistFilters {
  category?: ApplicationCategory
  isWinner?: boolean
  isActive?: boolean
}

export interface FinalistStats {
  total: number
  byCategory: Record<ApplicationCategory, number>
  winners: number
}

export const useFinalist = () => {
  const { fetchWithAuth } = useAuth()
  const config = useRuntimeConfig()

  const finalists = ref<Finalist[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить активных финалистов (публичный)
   */
  const getActiveFinalists = async (filters?: FinalistFilters): Promise<Finalist[]> => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.isWinner !== undefined) queryParams.append('isWinner', filters.isWinner.toString())

      const queryString = queryParams.toString()
      const url = `${config.public.apiUrl}/finalists${queryString ? `?${queryString}` : ''}`

      const response = await $fetch<{ success: boolean; data: Finalist[] }>(url)
      finalists.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить финалистов'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить всех финалистов (admin)
   */
  const getAllFinalists = async (filters?: FinalistFilters): Promise<Finalist[]> => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.isWinner !== undefined) queryParams.append('isWinner', filters.isWinner.toString())
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())

      const queryString = queryParams.toString()
      const url = `${config.public.apiUrl}/finalists/admin/all${queryString ? `?${queryString}` : ''}`

      const response = await fetchWithAuth<{ success: boolean; data: Finalist[] }>(url)
      finalists.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить финалистов'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить статистику финалистов (admin)
   */
  const getFinalistStats = async (): Promise<FinalistStats> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: FinalistStats }>(
        `${config.public.apiUrl}/finalists/admin/stats`
      )
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить статистику'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить финалиста по ID (admin)
   */
  const getFinalistById = async (id: string): Promise<Finalist> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: Finalist }>(
        `${config.public.apiUrl}/finalists/admin/${id}`
      )
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить финалиста'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Создать финалиста (admin)
   */
  const createFinalist = async (data: CreateFinalistData): Promise<Finalist> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: Finalist }>(
        `${config.public.apiUrl}/finalists/admin`,
        {
          method: 'POST',
          body: data,
        }
      )
      finalists.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось создать финалиста'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить финалиста (admin)
   */
  const updateFinalist = async (id: string, data: UpdateFinalistData): Promise<Finalist> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: Finalist }>(
        `${config.public.apiUrl}/finalists/admin/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      )

      // Обновить локальный стейт
      const index = finalists.value.findIndex(f => f.id === id)
      if (index !== -1) {
        finalists.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось обновить финалиста'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Удалить финалиста (admin)
   */
  const deleteFinalist = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/finalists/admin/${id}`,
        {
          method: 'DELETE',
        }
      )

      // Удалить из локального стейта
      finalists.value = finalists.value.filter(f => f.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Не удалось удалить финалиста'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Загрузить фото финалиста (admin)
   */
  const uploadFinalistPhoto = async (id: string, file: File): Promise<Finalist> => {
    loading.value = true
    error.value = null

    try {
      const { accessToken } = useAuth()
      const formData = new FormData()
      formData.append('photo', file)

      const response = await $fetch<{ success: boolean; data: Finalist }>(
        `${config.public.apiUrl}/finalists/admin/${id}/photo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: formData,
        }
      )

      // Обновить локальный стейт
      const index = finalists.value.findIndex(f => f.id === id)
      if (index !== -1) {
        finalists.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить фото'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить порядок отображения (admin)
   */
  const updateFinalistOrder = async (items: { id: string; order: number }[]): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/finalists/admin/order`,
        {
          method: 'PUT',
          body: items,
        }
      )
    } catch (err: any) {
      error.value = err.message || 'Не удалось обновить порядок'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить URL фото
   */
  const getPhotoUrl = (photoPath: string | null): string | null => {
    if (!photoPath) return null
    const baseUrl = config.public.apiUrl.replace('/api', '')
    return `${baseUrl}/${photoPath}`
  }

  /**
   * Получить название категории
   */
  const getCategoryLabel = (category: ApplicationCategory): string => {
    const labels: Record<ApplicationCategory, string> = {
      starter: 'Стартап',
      active: 'Активный бизнес',
      it: 'IT проект'
    }
    return labels[category] || category
  }

  return {
    finalists,
    loading,
    error,
    getActiveFinalists,
    getAllFinalists,
    getFinalistStats,
    getFinalistById,
    createFinalist,
    updateFinalist,
    deleteFinalist,
    uploadFinalistPhoto,
    updateFinalistOrder,
    getPhotoUrl,
    getCategoryLabel,
  }
}
