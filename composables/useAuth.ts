import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  emailVerified: boolean
  role?: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const accessToken = useCookie<string | null>('accessToken', {
    maxAge: 60 * 60, // 1 hour
    sameSite: 'lax',
  })

  const refreshToken = useCookie<string | null>('refreshToken', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  const user = useState<User | null>('user', () => null)

  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)

  const login = async (email: string, password: string) => {
    const response = await $fetch<AuthResponse>(`${config.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })

    // Store tokens
    accessToken.value = response.accessToken
    refreshToken.value = response.refreshToken
    user.value = response.user

    return response
  }

  const register = async (email: string, password: string, fullName: string, phone: string) => {
    const response = await $fetch<{ message: string; userId: string }>(
      `${config.public.apiUrl}/auth/register`,
      {
        method: 'POST',
        body: { email, password, fullName, phone },
      }
    )

    return response
  }

  const logout = async () => {
    if (refreshToken.value) {
      try {
        await $fetch(`${config.public.apiUrl}/auth/logout`, {
          method: 'POST',
          body: { refreshToken: refreshToken.value },
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Clear tokens and user
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    // Redirect to login
    router.push('/login')
  }

  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    const response = await $fetch<{ accessToken: string }>(
      `${config.public.apiUrl}/auth/refresh`,
      {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      }
    )

    accessToken.value = response.accessToken

    return response.accessToken
  }

  const getAuthHeaders = () => {
    if (!accessToken.value) {
      return {}
    }

    return {
      Authorization: `Bearer ${accessToken.value}`,
    }
  }

  // Auto-refresh access token on 401 errors
  const fetchWithAuth = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers = {
      ...options.headers,
      ...getAuthHeaders(),
    }

    try {
      return await $fetch<T>(url, {
        ...options,
        headers,
      })
    } catch (error: any) {
      // If 401 error, try to refresh token and retry
      if (error?.statusCode === 401 && refreshToken.value) {
        try {
          await refreshAccessToken()

          // Retry request with new token
          return await $fetch<T>(url, {
            ...options,
            headers: {
              ...options.headers,
              ...getAuthHeaders(),
            },
          })
        } catch (refreshError) {
          // Refresh failed, logout user
          await logout()
          throw refreshError
        }
      }

      throw error
    }
  }

  const fetchCurrentUser = async () => {
    if (!accessToken.value) {
      return null
    }

    try {
      const response = await fetchWithAuth<{ message: string; user: User }>(
        `${config.public.apiUrl}/auth/me`
      )

      user.value = response.user
      return response.user
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      return null
    }
  }

  return {
    user,
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    refreshAccessToken,
    getAuthHeaders,
    fetchWithAuth,
    fetchCurrentUser,
  }
}