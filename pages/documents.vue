<template>
  <div class="section-padding bg-gray-50">
    <div class="container-custom">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h1 class="mb-4 text-gray-900">{{ $t('documents.title') }}</h1>
        <p class="text-xl text-gray-600">{{ $t('documents.subtitle') }}</p>
      </div>

      <!-- Documents Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Document 1: Правила предоставления гранта -->
        <div class="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div class="p-8">
            <!-- Icon and Date -->
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="text-sm text-gray-500 text-right">
                <div>{{ $t('documents.uploadDate') }}</div>
                <div class="font-semibold text-gray-700">{{ $t('documents.doc1.date') }}</div>
              </div>
            </div>

            <!-- Title and Description -->
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t('documents.doc1.title') }}
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              {{ $t('documents.doc1.description') }}
            </p>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <a
                href="/uploads/documents/pravila-predostavleniya-granta.docx"
                download
                class="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ $t('documents.download') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Document 2: Шаблон бизнес-плана -->
        <div class="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div class="p-8">
            <!-- Icon and Date -->
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="text-sm text-gray-500 text-right">
                <div>{{ $t('documents.uploadDate') }}</div>
                <div class="font-semibold text-gray-700">{{ $t('documents.doc2.date') }}</div>
              </div>
            </div>

            <!-- Title and Description -->
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t('documents.doc2.title') }}
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              {{ $t('documents.doc2.description') }}
            </p>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <a
                href="/uploads/documents/shablon-biznes-plana.docx"
                download
                class="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ $t('documents.download') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Document 3: Приоритетные сектора экономики -->
        <div class="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div class="p-8">
            <!-- Icon and Date -->
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="text-sm text-gray-500 text-right">
                <div>{{ $t('documents.uploadDate') }}</div>
                <div class="font-semibold text-gray-700">{{ $t('documents.doc3.date') }}</div>
              </div>
            </div>

            <!-- Title and Description -->
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t('documents.doc3.title') }}
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              {{ $t('documents.doc3.description') }}
            </p>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <a
                href="/uploads/documents/prioritetnye-sektora.pdf"
                download
                class="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ $t('documents.download') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-12 max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('documents.help.title') }}</h3>
              <p class="text-gray-600 mb-4">{{ $t('documents.help.description') }}</p>
              <NuxtLink
                to="/contacts"
                class="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                <span>{{ $t('documents.help.contactUs') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
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

const { t } = useI18n()

useSeoMeta({
  title: t('documents.metaTitle'),
  description: t('documents.metaDescription'),
})
</script>
