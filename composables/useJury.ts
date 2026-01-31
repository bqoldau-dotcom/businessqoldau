import { ref } from 'vue'

export interface JuryMember {
  id: string
  fullName: string
  position: string
  organization: string | null
  photoPath: string | null
  bio: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateJuryMemberData {
  fullName: string
  position: string
  organization?: string
  bio?: string
  order?: number
  isActive?: boolean
}

export interface UpdateJuryMemberData {
  fullName?: string
  position?: string
  organization?: string | null
  bio?: string | null
  order?: number
  isActive?: boolean
}

export const useJury = () => {
  const { fetchWithAuth } = useAuth()
  const config = useRuntimeConfig()

  const juryMembers = ref<JuryMember[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить активных членов жюри (публичный)
   */
  const getActiveJuryMembers = async (): Promise<JuryMember[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; data: JuryMember[] }>(
        `${config.public.apiUrl}/jury`
      )
      juryMembers.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить членов жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить всех членов жюри (admin)
   */
  const getAllJuryMembers = async (): Promise<JuryMember[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: JuryMember[] }>(
        `${config.public.apiUrl}/jury/admin/all`
      )
      juryMembers.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить членов жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить члена жюри по ID (admin)
   */
  const getJuryMemberById = async (id: string): Promise<JuryMember> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: JuryMember }>(
        `${config.public.apiUrl}/jury/admin/${id}`
      )
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить члена жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Создать члена жюри (admin)
   */
  const createJuryMember = async (data: CreateJuryMemberData): Promise<JuryMember> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: JuryMember }>(
        `${config.public.apiUrl}/jury/admin`,
        {
          method: 'POST',
          body: data,
        }
      )
      juryMembers.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось создать члена жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить члена жюри (admin)
   */
  const updateJuryMember = async (id: string, data: UpdateJuryMemberData): Promise<JuryMember> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: JuryMember }>(
        `${config.public.apiUrl}/jury/admin/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      )

      // Обновить локальный стейт
      const index = juryMembers.value.findIndex(m => m.id === id)
      if (index !== -1) {
        juryMembers.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось обновить члена жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Удалить члена жюри (admin)
   */
  const deleteJuryMember = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/jury/admin/${id}`,
        {
          method: 'DELETE',
        }
      )

      // Удалить из локального стейта
      juryMembers.value = juryMembers.value.filter(m => m.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Не удалось удалить члена жюри'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Загрузить фото члена жюри (admin)
   */
  const uploadJuryPhoto = async (id: string, file: File): Promise<JuryMember> => {
    loading.value = true
    error.value = null

    try {
      const { accessToken } = useAuth()
      const formData = new FormData()
      formData.append('photo', file)

      const response = await $fetch<{ success: boolean; data: JuryMember }>(
        `${config.public.apiUrl}/jury/admin/${id}/photo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: formData,
        }
      )

      // Обновить локальный стейт
      const index = juryMembers.value.findIndex(m => m.id === id)
      if (index !== -1) {
        juryMembers.value[index] = response.data
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
  const updateJuryOrder = async (items: { id: string; order: number }[]): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/jury/admin/order`,
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

  return {
    juryMembers,
    loading,
    error,
    getActiveJuryMembers,
    getAllJuryMembers,
    getJuryMemberById,
    createJuryMember,
    updateJuryMember,
    deleteJuryMember,
    uploadJuryPhoto,
    updateJuryOrder,
    getPhotoUrl,
  }
}
