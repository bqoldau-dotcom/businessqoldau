<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Вход</h1>
          <p class="mt-2 text-gray-600">
            Войдите в личный кабинет для подачи заявки
          </p>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md">
        <!-- Application Period Status -->
        <div v-if="periodStatus && !periodStatus.isActive" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-semibold text-yellow-800">
                Регистрация временно недоступна
              </h3>
              <p class="mt-1 text-sm text-yellow-700">
                {{ periodStatus.message || 'Период подачи заявок не активен в данный момент' }}
              </p>
              <p v-if="settings" class="mt-2 text-xs text-yellow-600">
                Период подачи заявок: с {{ formatDate(settings.start_date) }} по {{ formatDate(settings.end_date) }}
              </p>
              <p class="mt-2 text-xs text-yellow-600 font-medium">
                Администраторы могут войти в систему в любое время
              </p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex border-b">
            <button
              @click="mode = 'login'"
              :class="[
                'flex-1 py-3 font-semibold transition-colors',
                mode === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              ]"
            >
              Вход
            </button>
            <button
              @click="mode = 'register'"
              :class="[
                'flex-1 py-3 font-semibold transition-colors',
                mode === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500',
                periodStatus && !periodStatus.isActive ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              :disabled="periodStatus && !periodStatus.isActive"
            >
              Регистрация
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Registration Form Step -->
          <template v-if="mode === 'register' && registrationStep === 'form'">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium mb-2">
                Полное имя <span class="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                minlength="2"
                maxlength="100"
                placeholder="Иванов Иван Иванович"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium mb-2">
                Телефон <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                placeholder="+77001234567"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-sm text-gray-500 mt-1">
                Формат: +77001234567
              </p>
            </div>

            <!-- Email -->
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

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium mb-2">
                Пароль <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Минимум 8 символов
              </p>
            </div>
          </template>

          <!-- Verification Step -->
          <template v-if="mode === 'register' && registrationStep === 'verification'">
            <div class="text-center mb-4">
              <p class="text-gray-700">
                Код подтверждения отправлен на
              </p>
              <p class="font-semibold text-gray-900">{{ form.email }}</p>
              <button
                type="button"
                @click="resetRegistration"
                class="text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                Изменить email
              </button>
            </div>

            <!-- Verification Code -->
            <div>
              <label for="verificationCode" class="block text-sm font-medium mb-2">
                Код подтверждения <span class="text-red-500">*</span>
              </label>
              <input
                id="verificationCode"
                v-model="form.verificationCode"
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

            <div class="text-center">
              <button
                type="button"
                @click="handleResendCode"
                :disabled="loading || resendCooldown > 0"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ resendCooldown > 0 ? `Отправить код повторно (${resendCooldown}с)` : 'Отправить код повторно' }}
              </button>
            </div>
          </template>

          <!-- Login Form -->
          <template v-if="mode === 'login'">
            <!-- Email -->
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

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="password" class="block text-sm font-medium">
                  Пароль <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="mode = 'forgot-password'; forgotPasswordStep = 'email'"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Забыли пароль?
                </button>
              </div>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Минимум 8 символов
              </p>
            </div>
          </template>

          <!-- Forgot Password Form -->
          <template v-if="mode === 'forgot-password'">
            <!-- Step 1: Email -->
            <template v-if="forgotPasswordStep === 'email'">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Восстановление пароля</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Введите email для получения кода восстановления
                </p>
              </div>

              <div>
                <label for="reset-email" class="block text-sm font-medium mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="reset-email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div class="text-center">
                <button
                  type="button"
                  @click="mode = 'login'"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Вернуться к входу
                </button>
              </div>
            </template>

            <!-- Step 2: Verification Code -->
            <template v-if="forgotPasswordStep === 'code'">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Введите код</h3>
                <p class="text-sm text-gray-600">
                  Код отправлен на
                </p>
                <p class="font-semibold text-gray-900">{{ form.email }}</p>
                <button
                  type="button"
                  @click="forgotPasswordStep = 'email'"
                  class="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Изменить email
                </button>
              </div>

              <div>
                <label for="reset-code" class="block text-sm font-medium mb-2">
                  Код восстановления <span class="text-red-500">*</span>
                </label>
                <input
                  id="reset-code"
                  v-model="form.resetCode"
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
            </template>

            <!-- Step 3: New Password -->
            <template v-if="forgotPasswordStep === 'password'">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Новый пароль</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Введите новый пароль для вашего аккаунта
                </p>
              </div>

              <div>
                <label for="new-password" class="block text-sm font-medium mb-2">
                  Новый пароль <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="new-password"
                    v-model="form.newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="8"
                    class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  </button>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Минимум 8 символов
                </p>
              </div>
            </template>
          </template>

          <div>
            <button
              type="submit"
              :disabled="loading || (mode === 'register' && registrationStep === 'verification' && form.verificationCode.length !== 6) || (mode === 'forgot-password' && forgotPasswordStep === 'code' && form.resetCode.length !== 6)"
              class="btn-primary w-full disabled:opacity-50"
            >
              {{
                loading ? 'Загрузка...' :
                mode === 'login' ? 'Войти' :
                mode === 'register' && registrationStep === 'form' ? 'Отправить код' :
                mode === 'register' && registrationStep === 'verification' ? 'Подтвердить и войти' :
                mode === 'forgot-password' && forgotPasswordStep === 'email' ? 'Отправить код' :
                mode === 'forgot-password' && forgotPasswordStep === 'code' ? 'Проверить код' :
                'Сохранить новый пароль'
              }}
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
const { login, register, user } = useAuth()
const { getApplicationSettings, settings, periodStatus, formatDate } = useSettings()

const mode = ref<'login' | 'register' | 'forgot-password'>('login')
const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  verificationCode: '',
  resetCode: '',
  newPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const registrationStep = ref<'form' | 'verification'>('form')
const forgotPasswordStep = ref<'email' | 'code' | 'password'>('email')
const pendingUserId = ref('')
const resendCooldown = ref(0)
let cooldownInterval: NodeJS.Timeout | null = null

// Check application period on page load
onMounted(async () => {
  try {
    await getApplicationSettings()
  } catch (e) {
    console.error('Failed to load application period settings:', e)
  }
})

const handleSubmit = async () => {
  if (mode.value === 'register') {
    if (registrationStep.value === 'form') {
      await handleSendCode()
    } else {
      await handleVerifyAndRegister()
    }
  } else if (mode.value === 'forgot-password') {
    if (forgotPasswordStep.value === 'email') {
      await handleSendResetCode()
    } else if (forgotPasswordStep.value === 'code') {
      await handleVerifyResetCode()
    } else {
      await handleResetPassword()
    }
  } else {
    await handleLogin()
  }
}

const handleSendCode = async () => {
  // Check if registration is blocked during inactive period
  if (periodStatus.value && !periodStatus.value.isActive) {
    error.value = 'Регистрация временно недоступна. ' + (periodStatus.value.message || '')
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiUrl}/auth/register`, {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone
      }
    })

    pendingUserId.value = (response as any).userId
    success.value = 'Код подтверждения отправлен на ваш email!'
    registrationStep.value = 'verification'

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
    // Handle APPLICATION_PERIOD_INACTIVE error from backend
    if (e.data?.code === 'APPLICATION_PERIOD_INACTIVE') {
      error.value = e.data.message
      await getApplicationSettings()
    } else {
      error.value = e.data?.message || e.message || 'Произошла ошибка при регистрации'
    }
  } finally {
    loading.value = false
  }
}

const handleVerifyAndRegister = async () => {
  if (form.verificationCode.length !== 6) {
    error.value = 'Введите 6-значный код подтверждения'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/auth/verify-email`, {
      method: 'POST',
      body: {
        email: form.email,
        code: form.verificationCode
      }
    })

    success.value = 'Email успешно подтвержден! Вход в систему...'

    // Auto-login after verification
    setTimeout(async () => {
      try {
        await login(form.email, form.password)
        if (user.value?.role === 'admin') {
          await navigateTo('/admin')
        } else {
          await navigateTo('/app')
        }
      } catch (e) {
        // If auto-login fails, just redirect to login
        registrationStep.value = 'form'
        mode.value = 'login'
        success.value = 'Email подтвержден! Теперь вы можете войти.'
      }
    }, 1500)
  } catch (e: any) {
    error.value = e.data?.message || 'Неверный код подтверждения'
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  if (!form.email) {
    error.value = 'Email не указан'
    return
  }

  loading.value = true
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
    form.verificationCode = ''

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
    loading.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    console.log('Attempting login...')
    const response = await login(form.email, form.password)
    console.log('Login successful, tokens saved:', {
      hasAccessToken: !!response.accessToken,
      hasRefreshToken: !!response.refreshToken,
      hasUser: !!response.user
    })

    // Check user role and redirect accordingly
    if (user.value?.role === 'admin') {
      await navigateTo('/admin')
    } else {
      await navigateTo('/app')
    }
  } catch (e: any) {
    console.error('Login error:', e)

    // Handle EMAIL_NOT_VERIFIED error from backend
    if (e.data?.code === 'EMAIL_NOT_VERIFIED') {
      error.value = e.data.message
      // Switch to verification step
      mode.value = 'register'
      registrationStep.value = 'verification'
      return
    }

    // Handle APPLICATION_PERIOD_INACTIVE error from backend
    if (e.data?.code === 'APPLICATION_PERIOD_INACTIVE') {
      error.value = e.data.message
      await getApplicationSettings()
    } else {
      error.value = e.data?.message || e.message || 'Произошла ошибка'
    }
  } finally {
    loading.value = false
  }
}

const handleSendResetCode = async () => {
  if (!form.email) {
    error.value = 'Введите email адрес'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      body: {
        email: form.email
      }
    })

    success.value = 'Код восстановления отправлен на ваш email'
    forgotPasswordStep.value = 'code'
    form.resetCode = ''
  } catch (e: any) {
    error.value = e.data?.message || 'Не удалось отправить код'
  } finally {
    loading.value = false
  }
}

const handleVerifyResetCode = async () => {
  if (!form.email || !form.resetCode) {
    error.value = 'Введите код подтверждения'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/auth/verify-reset-code`, {
      method: 'POST',
      body: {
        email: form.email,
        code: form.resetCode
      }
    })

    success.value = 'Код подтвержден! Введите новый пароль'
    forgotPasswordStep.value = 'password'
    form.newPassword = ''
  } catch (e: any) {
    error.value = e.data?.message || 'Неверный код восстановления'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!form.email || !form.resetCode || !form.newPassword) {
    error.value = 'Все поля обязательны'
    return
  }

  if (form.newPassword.length < 8) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/auth/reset-password`, {
      method: 'POST',
      body: {
        email: form.email,
        code: form.resetCode,
        password: form.newPassword
      }
    })

    success.value = 'Пароль успешно изменен! Перенаправление...'

    setTimeout(() => {
      mode.value = 'login'
      forgotPasswordStep.value = 'email'
      form.password = form.newPassword
      form.resetCode = ''
      form.newPassword = ''
      error.value = ''
      success.value = 'Теперь вы можете войти с новым паролем'
    }, 2000)
  } catch (e: any) {
    error.value = e.data?.message || 'Не удалось изменить пароль'
  } finally {
    loading.value = false
  }
}

const resetRegistration = () => {
  registrationStep.value = 'form'
  form.verificationCode = ''
  error.value = ''
  success.value = ''
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  resendCooldown.value = 0
}

// Watch mode changes to reset registration state
watch(mode, () => {
  resetRegistration()
})

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})

useSeoMeta({
  title: 'Вход - Business Qoldau 2025',
  description: 'Войдите в личный кабинет',
})
</script>