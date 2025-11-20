<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- JSON-LD Schema for FAQ -->
    <Head>
      <script type="application/ld+json" v-html="JSON.stringify(faqSchema)"></script>
    </Head>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            {{ $t('faq.title') }}
          </h1>
          <p class="text-xl text-white/90">
            {{ $t('faq.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="section-padding">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <!-- FAQ Items -->
          <div class="space-y-4">
            <!-- Q1 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(1)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 1"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q1.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 1 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 1"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q1.answer') }}
              </div>
            </div>

            <!-- Q2 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(2)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 2"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q2.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 2 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 2"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q2.answer') }}
              </div>
            </div>

            <!-- Q3 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(3)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 3"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q3.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 3 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 3"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q3.answer') }}
              </div>
            </div>

            <!-- Q4 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(4)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 4"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q4.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 4 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 4"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q4.answer') }}
              </div>
            </div>

            <!-- Q5 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(5)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 5"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q5.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 5 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 5"
                class="px-6 pb-6 space-y-3"
              >
                <p class="text-gray-700 leading-relaxed">
                  {{ $t('faq.q5.answer') }}
                </p>
                <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p class="text-amber-800 text-sm">
                    <strong>Важно:</strong> {{ $t('faq.q5.note') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Q6 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(6)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 6"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q6.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 6 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 6"
                class="px-6 pb-6"
              >
                <ul class="space-y-2">
                  <li
                    v-for="(item, index) in $tm('faq.q6.items')"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg class="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Q7 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(7)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 7"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q7.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 7 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 7"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q7.answer') }}
              </div>
            </div>

            <!-- Q8 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(8)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 8"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q8.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 8 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 8"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q8.answer') }}
              </div>
            </div>

            <!-- Q9 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(9)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 9"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q9.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 9 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 9"
                class="px-6 pb-6 text-gray-700 leading-relaxed"
              >
                {{ $t('faq.q9.answer') }}
              </div>
            </div>

            <!-- Q10 -->
            <div class="card overflow-hidden">
              <button
                @click="toggleQuestion(10)"
                class="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                :aria-expanded="openQuestion === 10"
              >
                <div class="flex-1 pr-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('faq.q10.question') }}
                  </h3>
                </div>
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-primary-600 transition-transform duration-200"
                    :class="{ 'rotate-180': openQuestion === 10 }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                v-show="openQuestion === 10"
                class="px-6 pb-6 space-y-3"
              >
                <p
                  v-for="(part, index) in $tm('faq.q10.parts')"
                  :key="index"
                  class="text-gray-700 leading-relaxed"
                >
                  {{ part }}
                </p>
              </div>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
            <h2 class="text-2xl font-bold mb-4">Остались вопросы?</h2>
            <p class="text-white/90 mb-6">
              Свяжитесь с нами, и мы с удовольствием ответим на все ваши вопросы
            </p>
            <NuxtLink to="/contacts" class="btn-secondary inline-flex items-center">
              Связаться с нами
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n()

const openQuestion = ref<number | null>(null)

const toggleQuestion = (questionNumber: number) => {
  if (openQuestion.value === questionNumber) {
    openQuestion.value = null
  } else {
    openQuestion.value = questionNumber
  }
}

// SEO: canonical and hreflang
const { setCanonicalAndHreflang } = useSeoHelpers()
setCanonicalAndHreflang()

// SEO: Breadcrumb Schema
const { setBreadcrumbSchema } = useBreadcrumb()
setBreadcrumbSchema()

// FAQ Schema.org structured data for rich snippets
const faqSchema = computed(() => {
  const questions = [
    { question: t('faq.q1.question'), answer: t('faq.q1.answer') },
    { question: t('faq.q2.question'), answer: t('faq.q2.answer') },
    { question: t('faq.q3.question'), answer: t('faq.q3.answer') },
    { question: t('faq.q4.question'), answer: t('faq.q4.answer') },
    { question: t('faq.q5.question'), answer: t('faq.q5.answer') + ' ' + t('faq.q5.note') },
    { question: t('faq.q6.question'), answer: tm('faq.q6.items').join(', ') },
    { question: t('faq.q7.question'), answer: t('faq.q7.answer') },
    { question: t('faq.q8.question'), answer: t('faq.q8.answer') },
    { question: t('faq.q9.question'), answer: t('faq.q9.answer') },
    { question: t('faq.q10.question'), answer: tm('faq.q10.parts').join(' ') }
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  }
})

// SEO meta tags
useSeoMeta({
  title: 'Часто задаваемые вопросы (FAQ) - Business Qoldau 2025',
  description: 'Ответы на популярные вопросы о гранте Business Qoldau: как участвовать, какие документы нужны, размер гранта, условия получения и многое другое.',
  keywords: 'faq грант казахстан, вопросы о гранте, как получить грант, условия гранта, документы для гранта, business qoldau вопросы, грант для предпринимателей вопросы',
  ogTitle: 'FAQ - Часто задаваемые вопросы о гранте Business Qoldau',
  ogDescription: 'Ответы на все ваши вопросы о получении гранта Business Qoldau для предпринимателей Казахстана',
  ogType: 'website',
  ogUrl: 'https://businessqoldau.kz/faq'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://businessqoldau.kz/faq' }
  ]
})
</script>
