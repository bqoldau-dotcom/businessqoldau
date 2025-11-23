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
                          <span v-if="application" class="px-2.5 py-1 text-xs rounded-lg font-semibold" :class="{
                        'bg-green-500/20 text-green-700': application.status === 'submitted',
                        'bg-yellow-500/20 text-yellow-700': application.status === 'draft',
                        'bg-emerald-500/20 text-emerald-700': application.status === 'accepted',
                        'bg-red-500/20 text-red-700': application.status === 'rejected',
                        'bg-blue-500/20 text-blue-700': application.status === 'revision',
                        'bg-orange-500/20 text-orange-700': application.status === 'withdrawn'
                      }">
                        {{
                          application.status === 'submitted' ? t('cabinet.submitted') :
                          application.status === 'draft' ? t('cabinet.draft') :
                          application.status === 'accepted' ? 'Принята' :
                          application.status === 'rejected' ? 'Отклонена' :
                          application.status === 'revision' ? 'На доработке' :
                          application.status === 'withdrawn' ? t('cabinet.application.statusWithdrawn') :
                          application.status
                        }}
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

                <!-- Delete Account Button -->
                <button @click="confirmDeleteAccount" class="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center group border-t border-gray-100 pt-6">
                  <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="font-medium">{{ t('cabinet.deleteAccount') }}</span>
                </button>

                <!-- Logout Button -->
                <button @click="handleLogout" class="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center group mt-2">
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
                          <span class="px-3 py-1 rounded-full text-xs font-medium" :class="{
                            'bg-green-100 text-green-700': application.status === 'submitted',
                            'bg-yellow-100 text-yellow-700': application.status === 'draft',
                            'bg-emerald-100 text-emerald-800': application.status === 'accepted',
                            'bg-red-100 text-red-800': application.status === 'rejected',
                            'bg-blue-100 text-blue-800': application.status === 'revision',
                            'bg-orange-100 text-orange-800': application.status === 'withdrawn'
                          }">
                            {{
                              application.status === 'submitted' ? t('cabinet.application.statusSubmitted') :
                              application.status === 'draft' ? t('cabinet.application.statusDraft') :
                              application.status === 'accepted' ? 'Заявка принята' :
                              application.status === 'rejected' ? 'Заявка отклонена' :
                              application.status === 'revision' ? 'На доработке' :
                              application.status === 'withdrawn' ? t('cabinet.application.statusWithdrawn') :
                              application.status
                            }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500">
                          {{ t('cabinet.application.createdOn') }}: {{ new Date(application.createdAt).toLocaleDateString('ru-RU') }}
                        </p>
                      </div>
                      <div class="flex gap-2">
                        <button
                          @click="viewingApplication = true"
                          class="btn-secondary"
                        >
                          {{ t('cabinet.application.viewApplication') }}
                        </button>
                        <button
                          v-if="application.status === 'submitted'"
                          @click="handleWithdrawApplication"
                          class="btn-secondary text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          {{ t('cabinet.application.withdraw') }}
                        </button>
                      </div>
                    </div>

                    <p class="text-gray-600 line-clamp-2">{{ application.summary }}</p>

                    <div class="mt-4 flex items-center gap-4 text-sm">
                      <div class="flex items-center text-gray-600">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span :class="applicationFiles.length > 0 ? 'text-green-600 font-medium' : 'text-gray-500'">
                          {{ applicationFiles.length > 0 ? `${applicationFiles.length} ${applicationFiles.length === 1 ? 'файл' : 'файлов'}` : t('cabinet.application.businessPlanNotUploaded') }}
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
              <span class="px-4 py-2 rounded-full text-sm font-medium" :class="{
                'bg-green-100 text-green-800': application.status === 'submitted',
                'bg-yellow-100 text-yellow-800': application.status === 'draft',
                'bg-emerald-100 text-emerald-900': application.status === 'accepted',
                'bg-red-100 text-red-900': application.status === 'rejected',
                'bg-blue-100 text-blue-900': application.status === 'revision',
                'bg-orange-100 text-orange-900': application.status === 'withdrawn'
              }">
                {{
                  application.status === 'submitted' ? t('cabinet.application.applicationSubmitted') :
                  application.status === 'draft' ? t('cabinet.application.statusDraft') :
                  application.status === 'accepted' ? 'Заявка принята организаторами' :
                  application.status === 'rejected' ? 'Заявка отклонена организаторами' :
                  application.status === 'revision' ? 'Заявка отправлена на доработку' :
                  application.status === 'withdrawn' ? t('cabinet.application.statusWithdrawn') :
                  application.status
                }}
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
                  <p class="text-gray-900 whitespace-pre-wrap break-words overflow-wrap-anywhere">{{ application.summary }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  {{ t('cabinet.application.businessPlan') }}
                  <span v-if="applicationFiles.length > 0" class="text-xs ml-2">({{ applicationFiles.length }} {{ applicationFiles.length === 1 ? 'файл' : 'файлов' }})</span>
                </label>
                <div v-if="applicationFiles.length > 0" class="space-y-2">
                  <div
                    v-for="file in applicationFiles"
                    :key="file.id"
                    class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div class="flex items-center flex-1 min-w-0 mr-4">
                      <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.fileName }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.fileSize) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="handleDownloadFile(file.id)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      :title="t('cabinet.application.downloadFile')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-else class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-gray-500">{{ t('cabinet.application.businessPlanNotUploaded') }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="application.status === 'draft' || application.status === 'revision' || application.status === 'withdrawn'" class="mt-8 flex gap-4">
              <button
                @click="editApplication"
                class="btn-secondary flex-1"
              >
                Редактировать
              </button>
              <button
                @click="handleSubmitApplication"
                :disabled="!canSubmitApplication"
                class="btn-primary flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': !canSubmitApplication }"
              >
                {{ application.status === 'revision' || application.status === 'withdrawn' ? 'Отправить повторно' : 'Отправить заявку' }}
              </button>
              <button
                v-if="application.status === 'draft'"
                @click="confirmDelete"
                class="btn-secondary"
              >
                Удалить
              </button>
            </div>

            <p v-if="(application.status === 'draft' || application.status === 'revision' || application.status === 'withdrawn') && !canSubmitApplication" class="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              ⚠️ Для отправки заявки необходимо загрузить бизнес-план
            </p>

            <!-- Notification for accepted/rejected status -->
            <div v-if="application.status === 'accepted'" class="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="font-semibold text-emerald-900">Поздравляем! Ваша заявка принята</p>
                  <p class="text-sm text-emerald-700 mt-1">Организаторы свяжутся с вами в ближайшее время для дальнейших инструкций. Проверьте вашу электронную почту для получения дополнительной информации.</p>
                </div>
              </div>
            </div>

            <div v-if="application.status === 'revision'" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div>
                  <p class="font-semibold text-blue-900">Ваша заявка требует доработки</p>
                  <p class="text-sm text-blue-700 mt-1">Проверьте вашу электронную почту для получения замечаний от организаторов. Внесите необходимые изменения и отправьте заявку повторно.</p>
                </div>
              </div>
            </div>

            <div v-if="application.status === 'rejected'" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="font-semibold text-red-900">К сожалению, ваша заявка была отклонена</p>
                  <p class="text-sm text-red-700 mt-1">Проверьте вашу электронную почту для получения подробной информации от организаторов. Вы можете использовать полученный опыт для улучшения вашего бизнес-проекта.</p>
                </div>
              </div>
            </div>

            <div v-if="application.status === 'withdrawn'" class="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                </svg>
                <div>
                  <p class="font-semibold text-orange-900">{{ t('cabinet.application.statusWithdrawn') }}</p>
                  <p class="text-sm text-orange-700 mt-1">{{ t('cabinet.application.withdrawnMessage') }}</p>
                </div>
              </div>
            </div>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('cabinet.application.businessPlan') }}
                <span class="text-xs text-gray-500 ml-2">({{ t('cabinet.application.filesCount', { count: applicationFiles.length, max: MAX_FILES }) }})</span>
              </label>

              <!-- File Upload Area -->
              <div v-if="applicationFiles.length < MAX_FILES" class="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  @change="handleMultipleFilesSelect"
                  accept=".pdf,.doc,.docx"
                  class="hidden"
                />

                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <button type="button" @click="$refs.fileInput.click()" class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    {{ t('cabinet.application.uploadFiles') }}
                  </button>
                  <p class="text-xs text-gray-500 mt-1">{{ t('cabinet.application.fileFormat') }}</p>
                  <p class="text-xs text-gray-500">{{ t('cabinet.application.maxFilesHint') }}</p>
                </div>
              </div>

              <!-- Uploaded Files List -->
              <div v-if="applicationFiles.length > 0" class="space-y-2">
                <div
                  v-for="file in applicationFiles"
                  :key="file.id"
                  class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <div class="flex items-center flex-1 min-w-0 mr-4">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ file.fileName }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.fileSize) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      @click="handleDownloadFile(file.id)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      :title="t('cabinet.application.downloadFile')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                    <button
                      v-if="application?.status === 'draft' || application?.status === 'revision' || application?.status === 'withdrawn'"
                      type="button"
                      @click="handleDeleteFile(file.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      :title="t('cabinet.application.deleteFile')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Max files reached message -->
              <div v-if="applicationFiles.length >= MAX_FILES" class="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mt-2">
                {{ t('cabinet.application.maxFilesReached') }}
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

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="showDeleteConfirmation = false">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ t('cabinet.deleteAccountTitle') }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ t('cabinet.deleteAccountWarning') }}</p>

          <div v-if="application" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-yellow-800 font-medium">{{ t('cabinet.deleteAccountWithApplication') }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="showDeleteConfirmation = false" class="flex-1 btn-secondary">
              {{ t('cabinet.cancel') }}
            </button>
            <button @click="handleDeleteAccount" class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition">
              {{ t('cabinet.confirmDelete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Withdraw Application Confirmation Modal -->
    <div v-if="showWithdrawConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="showWithdrawConfirmation = false">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ t('cabinet.application.withdrawTitle') }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ t('cabinet.application.withdrawConfirm') }}</p>

          <div class="flex gap-3">
            <button @click="showWithdrawConfirmation = false" class="flex-1 btn-secondary">
              {{ t('cabinet.cancel') }}
            </button>
            <button @click="confirmWithdrawApplication" class="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition">
              {{ t('cabinet.application.withdraw') }}
            </button>
          </div>
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

const { user, logout, fetchCurrentUser, deleteAccount } = useAuth()
const { profile, loading: profileLoading, error: profileError, fetchProfile, updateProfile, createProfile } = useProfile()
const {
  application,
  applicationFiles,
  loading: applicationLoading,
  uploadProgress,
  uploadingFiles,
  error: applicationError,
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  withdrawApplication,
  uploadFile,
  getApplicationFiles,
  uploadFiles,
  deleteFile,
  downloadFile
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

// Delete account state
const showDeleteConfirmation = ref(false)

// Withdraw application state
const showWithdrawConfirmation = ref(false)

// Multiple files handling
const selectedFiles = ref<File[]>([])
const MAX_FILES = 10

const handleMultipleFilesSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  console.log('📁 Files selected:', files.length, files.map(f => f.name))

  if (files.length === 0) return

  // Validate total count
  const currentFileCount = applicationFiles.value.length
  console.log('📊 Current files:', currentFileCount, 'New files:', files.length, 'Max:', MAX_FILES)

  if (currentFileCount + files.length > MAX_FILES) {
    alert(t('cabinet.application.maxFilesError'))
    return
  }

  // Validate each file
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  const maxSize = 20 * 1024 * 1024 // 20MB

  for (const file of files) {
    console.log('🔍 Validating file:', file.name, 'Type:', file.type, 'Size:', file.size)
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type)
      alert(t('cabinet.application.fileTypeError'))
      return
    }
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'bytes')
      alert(t('cabinet.application.fileSizeError'))
      return
    }
  }

  selectedFiles.value = files

  // If application exists, upload immediately
  if (application.value) {
    console.log('⬆️ Uploading files to application:', application.value.id)
    try {
      const result = await uploadFiles(application.value.id, files)
      console.log('✅ Upload successful:', result)
      selectedFiles.value = []
      // Clear input
      if (target) {
        target.value = ''
      }
    } catch (error) {
      console.error('❌ Failed to upload files:', error)
      alert(t('cabinet.application.uploadError'))
    }
  } else {
    console.warn('⚠️ No application exists, files will be uploaded when application is created')
  }
}

const handleDeleteFile = async (fileId: string) => {
  if (!application.value) return

  const confirmed = confirm(t('cabinet.application.deleteFileConfirm'))
  if (!confirmed) return

  try {
    await deleteFile(application.value.id, fileId)
  } catch (error) {
    console.error('Failed to delete file:', error)
    alert(t('cabinet.application.deleteError'))
  }
}

const handleDownloadFile = async (fileId: string) => {
  if (!application.value) return

  try {
    await downloadFile(application.value.id, fileId)
  } catch (error) {
    console.error('Failed to download file:', error)
    alert('Ошибка при скачивании файла')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Fetch user, profile, application and template on mount
onMounted(async () => {
  try {
    await fetchCurrentUser()
    await fetchProfile()
    await fetchApplications()
    templateInfo.value = await getActiveTemplate()

    // Load application files if application exists
    if (application.value) {
      await getApplicationFiles(application.value.id)
    }

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

    // Upload multiple files if selected (new system)
    if (selectedFiles.value.length > 0 && savedApplication) {
      try {
        console.log('⬆️ Uploading selected files after application creation:', selectedFiles.value.length)
        await uploadFiles(savedApplication.id, selectedFiles.value)
        selectedFiles.value = []

        // Clear input
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      } catch (uploadError) {
        console.error('Failed to upload files:', uploadError)
        alert(t('cabinet.application.uploadError'))
      }
    }

    // Upload file separately if selected (legacy single file system)
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

const handleWithdrawApplication = () => {
  if (!application.value) return
  showWithdrawConfirmation.value = true
}

const confirmWithdrawApplication = async () => {
  if (!application.value) return

  try {
    await withdrawApplication(application.value.id)
    showWithdrawConfirmation.value = false
    alert(t('cabinet.application.withdrawSuccess'))
  } catch (error) {
    console.error('Failed to withdraw application:', error)
    alert(t('cabinet.application.withdrawError'))
  }
}

const canSubmitApplication = computed(() => {
  // Check if application has files in the new table OR old planFilePath
  return (
    (applicationFiles.value.length > 0) ||
    (application.value?.planFilePath !== null && application.value?.planFilePath !== undefined)
  )
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

const confirmDeleteAccount = () => {
  showDeleteConfirmation.value = true
}

const handleDeleteAccount = async () => {
  try {
    await deleteAccount()
    // Tokens cleared and redirected to home page automatically in deleteAccount()
  } catch (error) {
    console.error('Failed to delete account:', error)
    alert(t('cabinet.deleteAccountError'))
    showDeleteConfirmation.value = false
  }
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

const editApplication = () => {
  if (application.value) {
    applicationForm.value = {
      category: application.value.category,
      summary: application.value.summary
    }
  }
  showApplicationForm.value = true
}

useSeoMeta({
  title: 'Личный кабинет - Business Qoldau 2025',
  description: 'Личный кабинет участника',
})
</script>
