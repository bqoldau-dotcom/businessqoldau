/**
 * Breadcrumb Schema.org generator
 */

export const useBreadcrumb = () => {
  const route = useRoute()
  const { t } = useI18n()
  const siteUrl = 'https://businessqoldau.kz'

  const breadcrumbItems = computed(() => {
    const path = route.path
    const items = [
      {
        name: t('nav.home'),
        url: siteUrl
      }
    ]

    // Map routes to breadcrumb items
    const routeMap: Record<string, string> = {
      '/how-to-apply': t('nav.howToApply'),
      '/documents': t('nav.documents'),
      '/faq': 'FAQ',
      '/contacts': t('nav.contacts'),
      '/terms': t('nav.terms'),
      '/privacy': t('nav.privacy'),
      '/app': t('nav.cabinet')
    }

    if (path !== '/' && routeMap[path]) {
      items.push({
        name: routeMap[path],
        url: `${siteUrl}${path}`
      })
    }

    return items
  })

  const breadcrumbSchema = computed(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems.value.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    }
  })

  const setBreadcrumbSchema = () => {
    if (breadcrumbItems.value.length > 1) {
      useHead({
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify(breadcrumbSchema.value)
          }
        ]
      })
    }
  }

  return {
    breadcrumbItems,
    breadcrumbSchema,
    setBreadcrumbSchema
  }
}
