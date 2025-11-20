<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="container-custom">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8 animate-fade-in-up">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">{{ t('cabinet.title') }}</h1>
              <p class="text-gray-600 text-lg">{{ t('cabinet.subtitle') }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="px-4 py-2 bg-white rounded-xl shadow-soft">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-gray-600">Онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-6 animate-slide-in-right">
              <div class="space-y-6">
                <!-- User Info -->
                <div class="border-b border-gray-100 pb-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="relative">
                      <div class="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {{ profile?.fullName?.charAt(0).toUpperCase() || 'U' }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-gray-900 truncate">{{ profile?.fullName || t('cabinet.user') }}</p>
                      <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
                    </div>
                  </div>
                </div>

                <!-- Navigation -->
                <nav class="space-y-2">
                  <button
                    @click="activeTab = 'profile'"
                    :class="[
                      'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group',
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span class="font-medium">{{ t('cabinet.myProfile') }}</span>
                    </span>
                  </button>
                  <button
                    @click="activeTab = 'applications'"
                    :class="[
                      'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group',
                      activeTab === 'applications'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="font-medium flex-1">{{ t('cabinet.myApplications') }}</span>
                      <span v-if="application" class="px-2.5 py-1 text-xs rounded-lg font-semibold" :class="application.status === 'submitted' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'">
                        {{ application.status === 'submitted' ? t('cabinet.submitted') : t('cabinet.draft') }}
                      </span>
                    </span>
                  </button>
                </nav>

                <!-- Quick Stats -->
                <div class="border-t border-gray-100 pt-6 space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Статус профиля</span>
                    <span class="font-semibold text-green-600">{{ profile ? 'Заполнен' : 'Не заполнен' }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Заявок</span>
                    <span class="font-semibold text-primary-600">{{ application ? '1' : '0' }}</span>
                  </div>
                </div>

                <!-- Logout Button -->
                <button @click="handleLogout" class="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center group border-t border-gray-100 pt-6">
                  <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span class="font-medium">{{ t('cabinet.logout') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Profile Tab -->
            <div v-show="activeTab === 'profile'" class="card p-8 animate-fade-in">
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ t('cabinet.profile.title') }}</h2>
                  <p class="text-gray-600">Управление личной информацией</p>
                </div>
                <button
                  v-if="profile && !editingProfile"
                  @click="editingProfile = true"
                  class="btn-outline flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{{ t('cabinet.profile.edit') }}</span>
                </button>
                <button
                  v-if="editingProfile"
                  @click="cancelEdit"
                  class="btn-ghost flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{{ t('cabinet.profile.cancel') }}</span>
                </button>
              </div>

              <div v-if="profileLoading" class="text-center py-16">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
                <p class="text-gray-500 mt-4 font-medium">{{ t('cabinet.loading') }}</p>
              </div>

              <!-- View Mode -->
              <div v-else-if="profile && !editingProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="card-gradient p-6 border-l-4 border-primary-500">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">{{ t('cabinet.profile.fullName') }}</label>
                        <p class="text-lg font-bold text-gray-900">{{ profile.fullName }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-gradient p-6 border-l-4 border-secondary-500">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">{{ t('cabinet.profile.email') }}</label>
                        <p class="text-lg font-bold text-gray-900 truncate">{{ user?.email || t('cabinet.profile.notSpecified') }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-gradient p-6 border-l-4 border-primary-500">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">{{ t('cabinet.profile.phone') }}</label>
                        <p class="text-lg font-bold text-gray-900">{{ profile.phone }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-gradient p-6 border-l-4 border-secondary-500">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">{{ t('cabinet.profile.city') }}</label>
                        <p class="text-lg font-bold text-gray-900">{{ profile.city || t('cabinet.profile.notSpecified') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <form v-else @submit.prevent="saveProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('cabinet.profile.fullName') }} *</label>
                    <input
                      v-model="profileForm.fullName"
                      type="text"
                      required
                      class="input-field"
                      :placeholder="t('cabinet.profile.enterFullName')"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('cabinet.profile.phone') }} *</label>
                    <input
                      v-model="profileForm.phone"
                      type="tel"
                      required
                      class="input-field"
                      placeholder="+77001234567"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('cabinet.profile.city') }}</label>
                    <input
                      v-model="profileForm.city"
                      type="text"
                      class="input-field"
                      :placeholder="t('cabinet.profile.enterCity')"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('cabinet.profile.email') }}</label>
                    <div class="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <p class="text-lg font-medium text-gray-700">{{ user?.email || t('cabinet.profile.notSpecified') }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ t('cabinet.profile.emailCannotChange') }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="profileError" class="flex items-start space-x-3 text-red-700 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <span class="font-medium">{{ profileError }}</span>
                </div>

                <button type="submit" class="btn-primary w-full text-lg py-4">
                  {{ t('cabinet.profile.saveChanges') }}
                </button>
              </form>
            </div>

            <!-- Applications Tab -->
            <div v-show="activeTab === 'applications'">
              <!-- Template Download Section -->
              <div v-if="templateInfo" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-4">
                    <div class="p-3 bg-blue-100 rounded-lg">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-1">{{ templateInfo.name }}</h3>
                      <p class="text-sm text-gray-600 mb-3">{{ t('cabinet.application.templateDescription') }}</p>
                      <button @click="handleDownloadTemplate" class="btn-primary text-sm inline-flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        {{ t('cabinet.application.downloadTemplate') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="applicationLoading" class="bg-white rounded-lg shadow-md p-6">
                <div class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p class="text-gray-500 mt-4">{{ t('cabinet.loading') }}</p>
                </div>
              </div>

              <!-- No Application -->
              <div v-else-if="!application" class="bg-white rounded-lg shadow-md p-6">
                <div class="text-center py-12">
                  <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('cabinet.application.noApplications') }}</h3>
                  <p class="mt-2 text-sm text-gray-500">{{ t('cabinet.application.createApplicationPrompt') }}</p>
                  <button @click="createNewApplication" class="mt-6 btn-primary">
                    {{ t('cabinet.application.createApplication') }}
                  </button>
                </div>
              </div>

              <!-- Application List -->
              <div v-else class="space-y-4">
                <!-- Application Card -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <div class="flex items-center gap-3 mb-2">
                          <h3 class="text-xl font-semibold text-gray-900">{{ getCategoryLabel(application.category) }}</h3>
                          <span class="px-3 py-1 rounded-full text-xs font-medium" :class="application.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                            {{ application.status === 'submitted' ? '✓ ' + t('cabinet.application.statusSubmitted') : t('cabinet.application.statusDraft') }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500">
                          {{ t('cabinet.application.createdOn') }}: {{ new Date(application.createdAt).toLocaleDateString('ru-RU') }}
                        </p>
                      </div>
                      <button
                        @click="viewingApplication = true"
                        class="btn-secondary"
                      >
                        {{ t('cabinet.application.viewApplication') }}
                      </button>
                    </div>

                    <p class="text-gray-600 line-clamp-2">{{ application.summary }}</p>

                    <div class="mt-4 flex items-center gap-4 text-sm">
                      <div class="flex items-center text-gray-600">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span :class="application.planFilePath ? 'text-green-600 font-medium' : 'text-gray-500'">
                          {{ application.planFilePath ? '✓ ' + t('cabinet.application.businessPlanUploaded') : t('cabinet.application.businessPlanNotUploaded') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application View Modal -->
    <div v-if="viewingApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="viewingApplication = false">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-900">Заявка на участие</h2>
          <button @click="viewingApplication = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div v-if="application && !showApplicationForm">
            <!-- Status Badge -->
            <div class="mb-6">
              <span class="px-4 py-2 rounded-full text-sm font-medium" :class="application.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ application.status === 'submitted' ? '✓ ' + t('cabinet.application.applicationSubmitted') : t('cabinet.application.statusDraft') }}
              </span>
              <p class="text-sm text-gray-500 mt-2">
                {{ t('cabinet.application.createdOn') }}: {{ new Date(application.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
            </div>

            <!-- Application Details -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">Категория</label>
                <p class="text-lg font-medium text-gray-900">{{ getCategoryLabel(application.category) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">Описание бизнеса</label>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-900 whitespace-pre-wrap">{{ application.summary }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">Бизнес-план</label>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" :class="application.planFilePath ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span :class="application.planFilePath ? 'text-green-600 font-medium' : 'text-gray-500'">
                    {{ application.planFilePath ? 'Файл загружен' : 'Файл не загружен' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex gap-4">
              <button
                v-if="application.status === 'draft'"
                @click="showApplicationForm = true"
                class="btn-secondary flex-1"
              >
                Редактировать
              </button>
              <button
                v-if="application.status === 'draft'"
                @click="handleSubmitApplication"
                :disabled="!canSubmitApplication"
                class="btn-primary flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': !canSubmitApplication }"
              >
                Отправить заявку
              </button>
              <button
                v-if="application.status === 'draft'"
                @click="confirmDelete"
                class="btn-secondary"
              >
                Удалить
              </button>
            </div>

            <p v-if="application.status === 'draft' && !canSubmitApplication" class="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              ⚠️ Для отправки заявки необходимо загрузить бизнес-план
            </p>
          </div>

          <!-- Edit Form -->
          <form v-if="showApplicationForm" @submit.prevent="saveApplication" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Категория *</label>
              <select
                v-model="applicationForm.category"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Выберите категорию</option>
                <option value="starter">Стартап (начинающий бизнес)</option>
                <option value="active">Активный бизнес</option>
                <option value="it">IT проект</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Описание бизнеса *</label>
              <textarea
                v-model="applicationForm.summary"
                required
                rows="6"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                :placeholder="t('cabinet.application.describeYourBusiness')"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Минимум 50 символов</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Бизнес-план</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  accept=".pdf,.doc,.docx"
                  class="hidden"
                />

                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="space-y-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Загрузка...</span>
                    <span>{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                </div>

                <div v-else-if="selectedFile || application?.planFilePath" class="text-center">
                  <div class="text-green-600 mb-2">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedFile?.name || 'Файл загружен' }}</p>
                  <button type="button" @click="$refs.fileInput.click()" class="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Выбрать другой файл
                  </button>
                </div>

                <div v-else class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <button type="button" @click="$refs.fileInput.click()" class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    {{ t('cabinet.application.uploadBusinessPlan') }}
                  </button>
                  <p class="text-xs text-gray-500 mt-1">{{ t('cabinet.application.fileFormat') }}</p>
                </div>
              </div>
            </div>

            <div v-if="applicationError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {{ applicationError }}
            </div>

            <div class="flex gap-4">
              <button type="submit" class="btn-primary flex-1">
                {{ application ? t('cabinet.application.saveChanges') : t('cabinet.application.createApplication') }}
              </button>
              <button type="button" @click="cancelApplicationEdit" class="btn-secondary">
                {{ t('cabinet.application.cancel') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApplicationCategory } from '~/composables/useApplication'

definePageMeta({
  middleware: 'auth'
})

const { user, logout, fetchCurrentUser } = useAuth()
const { profile, loading: profileLoading, error: profileError, fetchProfile, updateProfile, createProfile } = useProfile()
const {
  application,
  loading: applicationLoading,
  uploadProgress,
  error: applicationError,
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  uploadFile
} = useApplication()
const { getActiveTemplate, downloadTemplate } = useTemplate()
const { t } = useI18n()

// Tab state
const activeTab = ref<'profile' | 'applications'>('profile')

// Template state
const templateInfo = ref<any>(null)

// Profile editing state
const editingProfile = ref(false)
const profileForm = ref({
  fullName: '',
  phone: '',
  city: ''
})

// Application state
const viewingApplication = ref(false)
const showApplicationForm = ref(false)
const applicationForm = ref<{ category: ApplicationCategory | '', summary: string }>({
  category: '',
  summary: ''
})
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Fetch user, profile, application and template on mount
onMounted(async () => {
  try {
    await fetchCurrentUser()
    await fetchProfile()
    await fetchApplications()
    templateInfo.value = await getActiveTemplate()

    // If profile doesn't exist, enable edit mode
    if (!profile.value) {
      editingProfile.value = true
      profileForm.value = {
        fullName: '',
        phone: '',
        city: ''
      }
    }

    // If no application exists, switch to applications tab
    if (!application.value) {
      activeTab.value = 'applications'
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})

// Watch for profile changes to update form
watch(profile, (newProfile) => {
  if (newProfile && !editingProfile.value) {
    profileForm.value = {
      fullName: newProfile.fullName,
      phone: newProfile.phone,
      city: newProfile.city || ''
    }
  }
}, { immediate: true })

// Watch for application changes to update form
watch(application, (newApplication) => {
  if (newApplication && showApplicationForm.value) {
    applicationForm.value = {
      category: newApplication.category,
      summary: newApplication.summary
    }
  }
}, { immediate: true })

// Profile functions
const cancelEdit = () => {
  editingProfile.value = false
  if (profile.value) {
    profileForm.value = {
      fullName: profile.value.fullName,
      phone: profile.value.phone,
      city: profile.value.city || ''
    }
  }
}

const saveProfile = async () => {
  try {
    if (profile.value) {
      await updateProfile(profileForm.value)
    } else {
      await createProfile(profileForm.value)
    }
    editingProfile.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
  }
}

// Application functions
const cancelApplicationEdit = () => {
  showApplicationForm.value = false
  selectedFile.value = null
  if (application.value) {
    applicationForm.value = {
      category: application.value.category,
      summary: application.value.summary
    }
  }
}

const saveApplication = async () => {
  try {
    // Validate form
    if (!applicationForm.value.category || !applicationForm.value.summary) {
      return
    }

    if (applicationForm.value.summary.length < 50) {
      alert(t('cabinet.application.minLengthError'))
      return
    }

    let savedApplication

    // Create or update application (without file)
    if (application.value) {
      savedApplication = await updateApplication(application.value.id, {
        category: applicationForm.value.category as ApplicationCategory,
        summary: applicationForm.value.summary
      })
    } else {
      savedApplication = await createApplication({
        category: applicationForm.value.category as ApplicationCategory,
        summary: applicationForm.value.summary
      })
    }

    // Upload file separately if selected
    if (selectedFile.value && savedApplication) {
      try {
        await uploadFile(savedApplication.id, selectedFile.value)
        selectedFile.value = null
      } catch (uploadError) {
        console.error('Failed to upload file:', uploadError)
        alert(t('cabinet.application.uploadError'))
      }
    }

    showApplicationForm.value = false
  } catch (error) {
    console.error('Failed to save application:', error)
    alert(t('cabinet.application.saveError'))
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    alert(t('cabinet.application.fileTypeError'))
    return
  }

  // Validate file size (20MB)
  const maxSize = 20 * 1024 * 1024
  if (file.size > maxSize) {
    alert(t('cabinet.application.fileSizeError'))
    return
  }

  selectedFile.value = file

  // If application already exists, upload immediately
  if (application.value) {
    try {
      await uploadFile(application.value.id, file)
      selectedFile.value = null
    } catch (error) {
      console.error('Failed to upload file:', error)
    }
  }
}

const handleSubmitApplication = async () => {
  if (!application.value) return

  if (!canSubmitApplication.value) {
    alert(t('cabinet.application.uploadRequired').replace('⚠️ ', ''))
    return
  }

  const confirmed = confirm(t('cabinet.application.submitConfirm'))
  if (!confirmed) return

  try {
    await submitApplication(application.value.id)
    alert(t('cabinet.application.submitSuccess'))
    viewingApplication.value = false
  } catch (error) {
    console.error('Failed to submit application:', error)
    alert(t('cabinet.application.submitError'))
  }
}

const confirmDelete = async () => {
  if (!application.value) return

  const confirmed = confirm(t('cabinet.application.deleteConfirm'))
  if (!confirmed) return

  try {
    await deleteApplication(application.value.id)
    viewingApplication.value = false
    showApplicationForm.value = false
    applicationForm.value = {
      category: '',
      summary: ''
    }
  } catch (error) {
    console.error('Failed to delete application:', error)
    alert(t('cabinet.application.deleteError'))
  }
}

const canSubmitApplication = computed(() => {
  return application.value?.planFilePath !== null && application.value?.planFilePath !== undefined
})

const getCategoryLabel = (category: ApplicationCategory) => {
  const labels = {
    starter: t('cabinet.application.categoryStarter'),
    active: t('cabinet.application.categoryActive'),
    it: t('cabinet.application.categoryIT')
  }
  return labels[category] || category
}

const handleLogout = async () => {
  await logout()
}

const createNewApplication = () => {
  applicationForm.value = {
    category: '',
    summary: ''
  }
  selectedFile.value = null
  showApplicationForm.value = true
  viewingApplication.value = true
}

const handleDownloadTemplate = () => {
  if (templateInfo.value) {
    downloadTemplate(templateInfo.value)
  }
}

useSeoMeta({
  title: 'Личный кабинет - Business Qoldau 2025',
  description: 'Личный кабинет участника',
})
</script>
