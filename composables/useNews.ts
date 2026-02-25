import { ref } from 'vue'

export interface NewsArticle {
  id: string
  title: string
  content: string
  publishDate: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNewsData {
  title: string
  content: string
  publishDate?: string
  isActive?: boolean
}

export interface UpdateNewsData {
  title?: string
  content?: string
  publishDate?: string
  order?: number
  isActive?: boolean
}

export const useNews = () => {
  const { fetchWithAuth } = useAuth()
  const config = useRuntimeConfig()

  const newsArticles = ref<NewsArticle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить активные новости (публичный)
   */
  const getActiveNews = async (): Promise<NewsArticle[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; data: NewsArticle[] }>(
        `${config.public.apiUrl}/news`
      )
      newsArticles.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить новости'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить все новости (admin)
   */
  const getAllNews = async (): Promise<NewsArticle[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: NewsArticle[] }>(
        `${config.public.apiUrl}/news/admin/all`
      )
      newsArticles.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось загрузить новости'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Создать новость (admin)
   */
  const createNews = async (data: CreateNewsData): Promise<NewsArticle> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: NewsArticle }>(
        `${config.public.apiUrl}/news/admin`,
        {
          method: 'POST',
          body: data,
        }
      )
      newsArticles.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось создать новость'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить новость (admin)
   */
  const updateNews = async (id: string, data: UpdateNewsData): Promise<NewsArticle> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ success: boolean; data: NewsArticle }>(
        `${config.public.apiUrl}/news/admin/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      )

      const index = newsArticles.value.findIndex(n => n.id === id)
      if (index !== -1) {
        newsArticles.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Не удалось обновить новость'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Удалить новость (admin)
   */
  const deleteNews = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/news/admin/${id}`,
        {
          method: 'DELETE',
        }
      )

      newsArticles.value = newsArticles.value.filter(n => n.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Не удалось удалить новость'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить порядок отображения (admin)
   */
  const updateNewsOrder = async (items: { id: string; order: number }[]): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await fetchWithAuth<{ success: boolean }>(
        `${config.public.apiUrl}/news/admin/order`,
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
   * Форматирование даты публикации
   */
  const formatPublishDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    newsArticles,
    loading,
    error,
    getActiveNews,
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
    updateNewsOrder,
    formatPublishDate,
  }
}
