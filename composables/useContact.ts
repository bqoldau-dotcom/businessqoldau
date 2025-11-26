export const useContact = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || 'https://businessqoldau-997846271826.europe-west1.run.app/api'

  interface ContactData {
    name: string
    email: string
    message: string
  }

  interface ContactResponse {
    message: string
    contact: {
      id: string
      name: string
      email: string
      message: string
      created_at: string
    }
  }

  const submitContact = async (data: ContactData): Promise<ContactResponse> => {
    const response = await $fetch<ContactResponse>(`${apiUrl}/contacts`, {
      method: 'POST',
      body: data,
    })

    return response
  }

  return {
    submitContact,
  }
}
