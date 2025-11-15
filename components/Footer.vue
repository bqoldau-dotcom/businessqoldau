<template>
  <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"></div>
    </div>

    <div class="container-custom py-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <span class="text-white font-bold text-xl">BQ</span>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold leading-none">Business Qoldau</span>
              <span class="text-sm text-gray-400 font-medium">2025</span>
            </div>
          </div>
          <p class="text-gray-400 leading-relaxed mb-6 max-w-md">
            {{ $t('footer.description') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-bold mb-4">{{ $t('footer.navigation') }}</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                <span>{{ $t('nav.home') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/how-to-apply" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                <span>{{ $t('nav.howToApply') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/documents" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                <span>{{ $t('nav.documents') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contacts" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                <span>{{ $t('nav.contacts') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                <span>{{ $t('nav.privacy') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-lg font-bold mb-4">{{ $t('nav.contacts') }}</h4>
          <ul class="space-y-3">
            <li class="flex items-start space-x-3 text-gray-400">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@businesscamp.kz" class="hover:text-white transition-colors">
                info@businesscamp.kz
              </a>
            </li>
            <li class="flex items-start space-x-3 text-gray-400">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <a href="https://wa.me/77772600038?text=Здравствуйте" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                +7 (777) 260-00-38
              </a>
            </li>
            <li class="flex items-start space-x-3 text-gray-400">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.038-1.362 5.356-.168.557-.5.743-.82.761-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.001.321.023.465.141.122.099.155.232.171.326.016.094.036.308.02.475z"/>
              </svg>
              <a href="https://t.me/+XGtS6cT6QXE5Mjli" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                Telegram канал
              </a>
            </li>
            <li class="flex items-start space-x-3 text-gray-400">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Казахстан</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-gray-700/50 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-gray-400 text-sm text-center md:text-left">
            {{ $t('footer.copyright') }}
          </p>
          <div class="flex items-center space-x-6 text-sm text-gray-400">
            <NuxtLink to="/terms" class="hover:text-white transition-colors">
              Условия использования
            </NuxtLink>
            <span class="text-gray-700">|</span>
            <NuxtLink to="/privacy" class="hover:text-white transition-colors">
              Политика конфиденциальности
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>