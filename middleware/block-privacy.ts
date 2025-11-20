export default defineNuxtRouteMiddleware((to, from) => {
  // Redirect all users trying to access /privacy to home page
  return navigateTo('/')
})
