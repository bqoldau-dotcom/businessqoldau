/**
 * Composable для форматирования дат в казахстанском часовом поясе (UTC+5)
 * Решает проблему отображения времени в разных часовых поясах
 */

const KAZAKHSTAN_TIMEZONE = 'Asia/Almaty'

export const useDateFormat = () => {
  /**
   * Форматирует дату и время в казахстанском часовом поясе
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "10.12.2025, 23:11:43"
   */
  const formatDateTime = (dateString: string | Date): string => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      timeZone: KAZAKHSTAN_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * Форматирует только дату в казахстанском часовом поясе
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "10.12.2025"
   */
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      timeZone: KAZAKHSTAN_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  /**
   * Форматирует дату в длинном формате
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "10 декабря 2025 г."
   */
  const formatDateLong = (dateString: string | Date): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      timeZone: KAZAKHSTAN_TIMEZONE,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Форматирует дату для графиков (короткий формат)
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "10 дек"
   */
  const formatDateShort = (dateString: string | Date): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      timeZone: KAZAKHSTAN_TIMEZONE,
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Форматирует дату и время с указанием часового пояса
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "10.12.2025, 23:11:43 (Астана)"
   */
  const formatDateTimeWithTimezone = (dateString: string | Date): string => {
    return `${formatDateTime(dateString)} (Астана)`
  }

  /**
   * Форматирует дату для input[type="datetime-local"]
   * @param dateString - ISO строка даты или Date объект
   * @returns Строка в формате "2025-12-10T23:11"
   */
  const formatForInput = (dateString: string | Date): string => {
    const date = new Date(dateString)
    // Конвертируем в казахстанское время вручную (UTC+5)
    const kazakhstanOffset = 5 * 60 // минуты
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000
    const kazakhstanTime = new Date(utcTime + kazakhstanOffset * 60000)

    const year = kazakhstanTime.getFullYear()
    const month = String(kazakhstanTime.getMonth() + 1).padStart(2, '0')
    const day = String(kazakhstanTime.getDate()).padStart(2, '0')
    const hours = String(kazakhstanTime.getHours()).padStart(2, '0')
    const minutes = String(kazakhstanTime.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  /**
   * Конвертирует локальное казахстанское время в UTC ISO строку
   * @param localDateString - строка в формате "2025-12-10T23:11"
   * @returns ISO строка в UTC
   */
  const parseFromInput = (localDateString: string): string => {
    // Парсим как локальное казахстанское время и конвертируем в UTC
    const [datePart, timePart] = localDateString.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)

    // Создаём дату в UTC, учитывая смещение Казахстана (UTC+5)
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes))

    return utcDate.toISOString()
  }

  return {
    formatDateTime,
    formatDate,
    formatDateLong,
    formatDateShort,
    formatDateTimeWithTimezone,
    formatForInput,
    parseFromInput,
    KAZAKHSTAN_TIMEZONE
  }
}
