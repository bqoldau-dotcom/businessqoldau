export default defineNuxtPlugin(() => {
  const { accessToken, user } = useAuth()

  // Initialize user state if access token exists but user is null
  if (accessToken.value && !user.value) {
    // Set a minimal user object to prevent "No user after sign in" error
    user.value = {
      id: 'loading',
      email: 'loading...',
      emailVerified: true
    }
  }
})
