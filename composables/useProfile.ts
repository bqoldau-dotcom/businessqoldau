import { ref } from 'vue'

export interface Profile {
  id: string
  userId: string
  fullName: string
  phone: string
  city: string | null
  createdAt: string
  updatedAt: string
}

export interface ProfileInput {
  fullName: string
  phone: string
  city?: string
}

export interface ProfileUpdateInput {
  fullName?: string
  phone?: string
  city?: string
}

export const useProfile = () => {
  const config = useRuntimeConfig()
  const { fetchWithAuth } = useAuth()

  const profile = useState<Profile | null>('profile', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; profile: Profile | null }>(
        `${config.public.apiUrl}/profile`
      )

      profile.value = response.profile
      return response.profile
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (data: ProfileInput) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; profile: Profile }>(
        `${config.public.apiUrl}/profile`,
        {
          method: 'POST',
          body: data,
        }
      )

      profile.value = response.profile
      return response.profile
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to create profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: ProfileUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth<{ message: string; profile: Profile }>(
        `${config.public.apiUrl}/profile`,
        {
          method: 'PUT',
          body: data,
        }
      )

      profile.value = response.profile
      return response.profile
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    getProfile,
    fetchProfile: getProfile, // Alias for consistency
    createProfile,
    updateProfile,
  }
}