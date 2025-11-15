/**
 * SEO Helpers - Canonical URLs and hreflang tags
 */

export const useSeoHelpers = () => {
  const route = useRoute()
  const siteUrl = 'https://businessqoldau.kz'

  /**
   * Set canonical URL and hreflang tags for current page
   */
  const setCanonicalAndHreflang = () => {
    const currentPath = route.path
    const canonicalUrl = `${siteUrl}${currentPath}`

    useHead({
      link: [
        // Canonical URL
        { rel: 'canonical', href: canonicalUrl },

        // hreflang tags - same URL for both languages (strategy: no_prefix)
        { rel: 'alternate', hreflang: 'ru', href: canonicalUrl },
        { rel: 'alternate', hreflang: 'kk', href: canonicalUrl },
        { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }
      ]
    })
  }

  return {
    setCanonicalAndHreflang
  }
}
