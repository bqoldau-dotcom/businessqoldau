import { ref } from 'vue'
import { useAuth } from './useAuth'

export interface ApplicationPeriodSettings {
  start_date: string
  end_date: string
  is_active: boolean
  message: string
}

export interface PeriodStatus {
  isActive: boolean
  message?: string
  settings?: ApplicationPeriodSettings
}

export interface SettingsResponse {
  success: boolean
  data: {
    settings: ApplicationPeriodSettings
    periodStatus: PeriodStatus
  }
  message?: string
}

export const useSettings = () => {
  const config = useRuntimeConfig()
  const { fetchWithAuth } = useAuth()

  const settings = ref<ApplicationPeriodSettings | null>(null)
  const periodStatus = ref<PeriodStatus | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить настройки периода подачи заявок (публичный endpoint)
   */
  const getApplicationSettings = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<SettingsResponse>(
        `${config.public.apiUrl}/settings/application-period`
      )

      settings.value = response.data.settings
      periodStatus.value = response.data.periodStatus

      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Ошибка при загрузке настроек'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить настройки периода подачи заявок (admin only)
   */
  const updateApplicationSettings = async (startDate: string, endDate: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{
        success: boolean
        data: ApplicationPeriodSettings
        message: string
      }>(`${config.public.apiUrl}/settings/application-period`, {
        method: 'PUT',
        body: {
          start_date: startDate,
          end_date: endDate,
        },
      })

      settings.value = response.data

      // Обновляем статус после изменения настроек
      await getApplicationSettings()

      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Ошибка при обновлении настроек'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Проверить активность периода подачи заявок
   */
  const checkApplicationPeriod = async (): Promise<PeriodStatus> => {
    try {
      const response = await getApplicationSettings()
      return response.data.periodStatus
    } catch (err) {
      return {
        isActive: false,
        message: 'Не удалось проверить период подачи заявок',
      }
    }
  }

  /**
   * Форматировать дату для отображения
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  /**
   * Форматировать дату для input[type="datetime-local"]
   */
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return {
    settings,
    periodStatus,
    loading,
    error,
    getApplicationSettings,
    updateApplicationSettings,
    checkApplicationPeriod,
    formatDate,
    formatDateForInput,
  }
}
