<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Подтверждение Email</h1>
          <p class="mt-2 text-gray-600">
            Введите 6-значный код, отправленный на вашу почту
          </p>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md">
          <form @submit.prevent="handleVerify" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="code" class="block text-sm font-medium mb-2">
                Код подтверждения <span class="text-red-500">*</span>
              </label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                required
                maxlength="6"
                pattern="[0-9]{6}"
                placeholder="123456"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-bold"
              />
              <p class="text-sm text-gray-500 mt-1">
                Введите 6-значный код из письма
              </p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading || form.code.length !== 6"
                class="btn-primary w-full disabled:opacity-50"
              >
                {{ loading ? 'Проверка...' : 'Подтвердить' }}
              </button>
            </div>

            <div class="text-center">
              <button
                type="button"
                @click="handleResend"
                :disabled="resendLoading || resendCooldown > 0"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ resendCooldown > 0 ? `Отправить код повторно (${resendCooldown}с)` : 'Отправить код повторно' }}
              </button>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>

            <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
              {{ success }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const route = useRoute()

const form = reactive({
  email: (route.query.email as string) || '',
  code: ''
})

const loading = ref(false)
const resendLoading = ref(false)
const error = ref('')
const success = ref('')
const resendCooldown = ref(0)

let cooldownInterval: NodeJS.Timeout | null = null

const handleVerify = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiUrl}/auth/verify-email`, {
      method: 'POST',
      body: {
        email: form.email,
        code: form.code
      }
    })

    success.value = 'Email успешно подтвержден! Перенаправление...'

    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  } catch (e: any) {
    error.value = e.data?.message || 'Неверный код подтверждения'
  } finally {
    loading.value = false
  }
}

const handleResend = async () => {
  if (!form.email) {
    error.value = 'Введите email адрес'
    return
  }

  resendLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/auth/resend-code`, {
      method: 'POST',
      body: {
        email: form.email
      }
    })

    success.value = 'Новый код отправлен на вашу почту'
    form.code = ''

    // Start cooldown
    resendCooldown.value = 60
    cooldownInterval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0 && cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }, 1000)
  } catch (e: any) {
    error.value = e.data?.message || 'Не удалось отправить код'
  } finally {
    resendLoading.value = false
  }
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})

useSeoMeta({
  title: 'Подтверждение Email - Инновационный грант Business Qoldau',
  description: 'Подтвердите ваш email адрес',
})
</script>
