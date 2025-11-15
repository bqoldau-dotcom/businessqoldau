export default defineNuxtPlugin(async (nuxtApp) => {
  // Динамически импортируем JSON файлы с переводами
  const ru = await import('~/locales/ru.json')
  const kk = await import('~/locales/kk.json')

  // Получаем доступ к i18n через nuxtApp
  const i18n = nuxtApp.$i18n as any

  // Загружаем переводы для каждого языка
  i18n.setLocaleMessage('ru', ru.default || ru)
  i18n.setLocaleMessage('kk', kk.default || kk)

  console.log('✅ i18n plugin: Переводы загружены успешно')
  console.log('📦 Русский язык:', Object.keys(ru.default || ru))
  console.log('📦 Казахский язык:', Object.keys(kk.default || kk))
})
