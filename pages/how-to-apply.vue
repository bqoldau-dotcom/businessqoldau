<template>
  <div class="py-16">
    <div class="container-custom">
      <div class="max-w-4xl mx-auto">
        <h1 class="mb-8">{{ $t('howToApply.title') }}</h1>

        <div class="space-y-8">
          <!-- Step 1 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div class="flex-1">
                <h3 class="mb-2">{{ $t('howToApply.step1.title') }}</h3>
                <p class="text-gray-600">
                  {{ $t('howToApply.step1.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div class="flex-1">
                <h3 class="mb-2">{{ $t('howToApply.step2.title') }}</h3>
                <p class="text-gray-600">
                  {{ $t('howToApply.step2.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div class="flex-1">
                <h3 class="mb-2">{{ $t('howToApply.step3.title') }}</h3>
                <p class="text-gray-600">
                  {{ $t('howToApply.step3.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div class="flex-1">
                <h3 class="mb-2">{{ $t('howToApply.step4.title') }}</h3>
                <p class="text-gray-600">
                  {{ $t('howToApply.step4.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="bg-blue-50 p-6 rounded-lg mt-12">
            <h3 class="mb-4">{{ $t('howToApply.categories.title') }}</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-blue-600">{{ $t('howToApply.categories.starter.title') }}</h4>
                <p class="text-gray-600">{{ $t('howToApply.categories.starter.description') }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-blue-600">{{ $t('howToApply.categories.active.title') }}</h4>
                <p class="text-gray-600">{{ $t('howToApply.categories.active.description') }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-blue-600">{{ $t('howToApply.categories.it.title') }}</h4>
                <p class="text-gray-600">{{ $t('howToApply.categories.it.description') }}</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center mt-12">
            <NuxtLink to="/app" class="btn-primary">
              {{ $t('howToApply.applyButton') }}
            </NuxtLink>
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

useSeoMeta({
  title: 'Как подать заявку - Business Qoldau 2025',
  description: 'Пошаговая инструкция по подаче заявки на участие в гранте',
})
</script>
