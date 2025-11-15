export default defineNuxtRouteMiddleware(async (to, from) => {
  const { accessToken, user } = useAuth()

  // Check if user is authenticated
  if (!accessToken.value) {
    return navigateTo('/login')
  }

  // Check if user data is loaded
  if (!user.value) {
    // Try to fetch user data
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

  // Check if user has admin role
  if (user.value?.role !== 'admin') {
    return navigateTo('/app')
  }
})
