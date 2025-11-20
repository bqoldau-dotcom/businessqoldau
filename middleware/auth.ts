export default defineNuxtRouteMiddleware(async (to, from) => {
  const { accessToken, user } = useAuth()

  // Check if user has access token in cookies
  if (!accessToken.value) {
    return navigateTo('/login')
  }

  // Fetch user data if not loaded
  if (!user.value) {
    const config = useRuntimeConfig()
    try {
      const response = await $fetch(`${config.public.apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
      user.value = response.user
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      return navigateTo('/login')
    }
  }

  // Redirect admin users to admin panel
  if (user.value?.role === 'admin') {
    return navigateTo('/admin')
  }
})