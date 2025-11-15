<template>
  <header class="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
    <nav class="container-custom py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 group"
        >
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span class="text-white font-bold text-xl">BQ</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent leading-none">
                Business Qoldau
              </span>
              <span class="text-xs text-gray-500 font-medium">2025</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-1">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            to="/how-to-apply"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            {{ $t('nav.howToApply') }}
          </NuxtLink>
          <NuxtLink
            to="/documents"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            {{ $t('nav.documents') }}
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            FAQ
          </NuxtLink>
          <NuxtLink
            to="/contacts"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            {{ $t('nav.contacts') }}
          </NuxtLink>
        </div>

        <!-- Auth & Language -->
        <div class="hidden lg:flex items-center space-x-3">
          <!-- Language Switcher -->
          <div class="flex bg-gray-100 rounded-lg p-1 space-x-1">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              @click="setLocale(locale.code)"
              :class="[
                'px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200',
                currentLocale === locale.code
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ locale.code === 'kk' ? 'KZ' : locale.code.toUpperCase() }}
            </button>
          </div>

          <!-- Auth Buttons -->
          <NuxtLink
            v-if="!user"
            to="/login"
            class="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {{ $t('nav.login') }}
          </NuxtLink>
          <NuxtLink
            v-else
            to="/app"
            class="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ $t('nav.cabinet') }}</span>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="mobileMenuOpen"
          class="lg:hidden mt-4 pb-4 border-t pt-4 space-y-2"
        >
          <NuxtLink
            to="/"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            to="/how-to-apply"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {{ $t('nav.howToApply') }}
          </NuxtLink>
          <NuxtLink
            to="/documents"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {{ $t('nav.documents') }}
          </NuxtLink>
          <NuxtLink
            to="/faq"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            FAQ
          </NuxtLink>
          <NuxtLink
            to="/contacts"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {{ $t('nav.contacts') }}
          </NuxtLink>

          <!-- Mobile Language Switcher -->
          <div class="flex space-x-2 px-4 py-2">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              @click="setLocale(locale.code)"
              :class="[
                'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                currentLocale === locale.code
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ locale.code === 'kk' ? 'KZ' : locale.code.toUpperCase() }}
            </button>
          </div>

          <!-- Mobile Auth Button -->
          <div class="px-4 pt-2">
            <NuxtLink
              v-if="!user"
              to="/login"
              @click="mobileMenuOpen = false"
              class="block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center rounded-lg font-semibold"
            >
              {{ $t('nav.login') }}
            </NuxtLink>
            <NuxtLink
              v-else
              to="/app"
              @click="mobileMenuOpen = false"
              class="block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center rounded-lg font-semibold"
            >
              {{ $t('nav.cabinet') }}
            </NuxtLink>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale: setI18nLocale } = useI18n()
const { user } = useAuth()
const mobileMenuOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

const setLocale = (code: string) => {
  setI18nLocale(code)
  mobileMenuOpen.value = false
}
</script>