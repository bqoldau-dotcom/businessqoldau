<template>
  <div class="py-16">
    <div class="container-custom">
      <div class="max-w-2xl mx-auto">
        <h1 class="mb-8 text-center">{{ $t('nav.contacts') }}</h1>

        <!-- Contact Info -->
        <div class="bg-white p-8 rounded-lg shadow-md mb-8">
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">Email</h3>
              <a href="mailto:qoldaubusiness@gmail.com" class="text-blue-600 hover:underline">
                qoldaubusiness@gmail.com
              </a>
            </div>
            <div>
              <h3 class="font-semibold mb-2">{{ $t('contactPage.phone') }}</h3>
              <a href="tel:+77772600038" class="text-blue-600 hover:underline">
                +7 (777) 260-00-38
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-6">{{ $t('contactPage.formTitle') }}</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-2">
                {{ $t('forms.name') }} <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium mb-2">
                {{ $t('forms.email') }} <span class="text-red-500">*</span>
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
              <label for="message" class="block text-sm font-medium mb-2">
                {{ $t('forms.message') }} <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? $t('contactPage.sending') : $t('forms.submit') }}
              </button>
            </div>

            <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {{ $t('contactPage.successMessage') }}
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {{ error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO: canonical and hreflang
const { setCanonicalAndHreflang } = useSeoHelpers()
setCanonicalAndHreflang()

// SEO: Breadcrumb Schema
const { setBreadcrumbSchema } = useBreadcrumb()
setBreadcrumbSchema()

const { submitContact } = useContact()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    await submitContact({
      name: form.name,
      email: form.email,
      message: form.message,
    })

    success.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e: any) {
    console.error('Contact form error:', e)
    const { $t } = useI18n()
    error.value = e.data?.message || e.message || $t('contactPage.errorMessage')
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Контакты - Business Qoldau 2025',
  description: 'Свяжитесь с нами по любым вопросам',
})
</script>