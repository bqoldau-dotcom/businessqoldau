export default defineEventHandler(() => {
  return [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: '/how-to-apply',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: '/documents',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/faq',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: '/contacts',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: '/terms',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.5
    },
    {
      loc: '/privacy',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.5
    }
  ]
})
