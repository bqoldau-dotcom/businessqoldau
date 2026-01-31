<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="px-6">
        <div class="flex items-center justify-between py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <p class="text-sm text-gray-600">Business Qoldau 2025</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ user?.email }}</span>
            <button @click="handleLogout" class="btn-secondary">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white border-r min-h-[calc(100vh-73px)] sticky top-[73px]">
        <nav class="p-4 space-y-1">
          <button
            @click="activeTab = 'applications'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'applications'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Заявки</span>
          </button>

          <button
            @click="activeTab = 'users'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'users'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>Пользователи</span>
          </button>

          <button
            @click="activeTab = 'templates'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'templates'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span>Шаблоны</span>
          </button>

          <button
            @click="activeTab = 'contacts'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'contacts'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Обращения</span>
          </button>

          <button
            @click="activeTab = 'stats'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'stats'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span>Статистика</span>
          </button>

          <button
            @click="activeTab = 'settings'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Период подачи</span>
          </button>

          <div class="my-4 border-t border-gray-200"></div>

          <button
            @click="activeTab = 'jury'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'jury'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Жюри</span>
          </button>

          <button
            @click="activeTab = 'finalists'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left',
              activeTab === 'finalists'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            <span>Финалисты</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 mt-4">Загрузка...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-700">{{ error }}</p>
        <button @click="loadData" class="mt-4 btn-primary">
          Попробовать снова
        </button>
      </div>

      <!-- Applications Tab -->
      <div v-else-if="activeTab === 'applications'" class="space-y-6">
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex flex-wrap gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                v-model="filters.category"
                @change="loadApplications"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все</option>
                <option value="starter">Стартапы</option>
                <option value="active">Активные</option>
                <option value="it">IT проекты</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button @click="resetFilters" class="btn-secondary">
                Сбросить фильтры
              </button>
              <button
                @click="handleExportApplications"
                :disabled="exportLoading"
                class="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ exportLoading ? 'Экспорт...' : 'Экспорт в Excel' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="applications.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    Заявок не найдено
                  </td>
                </tr>
                <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {{ app.id.substring(0, 8) }}...
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ app.user?.profile?.fullName || 'Не указано' }}</div>
                    <div class="text-sm text-gray-500">{{ app.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ getCategoryLabel(app.category) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(app.createdAt).toLocaleDateString('ru-RU') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex items-center gap-3">
                      <button @click="viewApplication(app)" class="text-blue-600 hover:text-blue-800 font-medium">
                        Посмотреть
                      </button>
                      <a
                        v-if="app.planFilePath"
                        :href="`${apiUrl.replace('/api', '')}/${app.planFilePath}`"
                        download
                        target="_blank"
                        class="text-green-600 hover:text-green-800 transition-colors"
                        title="Скачать бизнес-план"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </a>
                      <span
                        v-else
                        class="text-gray-300"
                        title="Файл не загружен"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination" class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Показано {{ applications.length }} из {{ pagination.total }}
            </div>
            <div class="flex gap-2">
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Назад
              </button>
              <span class="px-3 py-1">Страница {{ pagination.page }} из {{ pagination.pages }}</span>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.pages"
                class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-else-if="activeTab === 'users'" class="space-y-6">
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
              <input
                v-model="userFilters.search"
                type="text"
                placeholder="Email или имя..."
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Роль</label>
              <select
                v-model="userFilters.role"
                @change="loadUsers"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все</option>
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email статус</label>
              <select
                v-model="userFilters.emailVerified"
                @change="loadUsers"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все</option>
                <option value="true">Подтвержден</option>
                <option value="false">Не подтвержден</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button @click="resetUserFilters" class="btn-secondary">
                Сбросить фильтры
              </button>
              <button
                @click="handleExportUsers"
                :disabled="exportLoading"
                class="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ exportLoading ? 'Экспорт...' : 'Экспорт в Excel' }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Город</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата регистрации</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="users.length === 0">
                  <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    Пользователей не найдено
                  </td>
                </tr>
                <tr v-for="userItem in users" :key="userItem.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {{ userItem.id.substring(0, 8) }}...
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ userItem.email }}</div>
                    <div v-if="userItem.emailVerified" class="text-xs text-green-600">✓ Подтвержден</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ userItem.profile?.fullName || '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ userItem.profile?.phone || '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ userItem.profile?.city || '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ userItem.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(userItem.createdAt).toLocaleDateString('ru-RU') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="userPagination" class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Показано {{ users.length }} из {{ userPagination.total }}
            </div>
            <div class="flex gap-2">
              <button
                @click="changeUserPage(userPagination.page - 1)"
                :disabled="userPagination.page <= 1"
                class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Назад
              </button>
              <span class="px-3 py-1">Страница {{ userPagination.page }} из {{ userPagination.totalPages }}</span>
              <button
                @click="changeUserPage(userPagination.page + 1)"
                :disabled="userPagination.page >= userPagination.totalPages"
                class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contacts Tab -->
      <div v-else-if="activeTab === 'contacts'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Обращения от пользователей</h3>
            <div class="text-sm text-gray-500">
              Всего: {{ contacts.length }}
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Загрузка обращений...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <div class="text-red-600 mb-2">Ошибка загрузки</div>
            <p class="text-gray-600">{{ error }}</p>
            <button 
              @click="loadContacts" 
              class="mt-4 btn-primary text-sm"
            >
              Попробовать снова
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="contacts.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Нет обращений</h3>
            <p class="mt-1 text-sm text-gray-500">Пока нет обращений от пользователей</p>
          </div>

          <!-- Contacts List -->
          <div v-else class="space-y-4">
            <div 
              v-for="contact in contacts" 
              :key="contact.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="selectedContact = contact"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="text-sm font-medium text-gray-900 truncate">
                      {{ contact.name }}
                    </h4>
                    <span class="text-xs text-gray-500">
                      {{ contact.email }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ contact.message }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0 text-xs text-gray-500">
                  {{ formatDate(contact.createdAt) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="contactPagination && contactPagination.totalPages > 1" class="mt-6 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                @click="loadContacts(contactPagination.page - 1)"
                :disabled="contactPagination.page <= 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span class="px-3 py-2 text-sm text-gray-700">
                Страница {{ contactPagination.page }} из {{ contactPagination.totalPages }}
              </span>
              <button
                @click="loadContacts(contactPagination.page + 1)"
                :disabled="contactPagination.page >= contactPagination.totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-else-if="activeTab === 'stats'" class="space-y-6">
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Users Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Всего пользователей</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.totalUsers || 0 }}</p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Applications Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Всего заявок</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.total || 0 }}</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Submitted Applications Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Отправленные заявки</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.byStatus?.submitted || 0 }}</p>
              </div>
              <div class="bg-purple-100 rounded-full p-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Contacts Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Всего обращений</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.totalContacts || 0 }}</p>
              </div>
              <div class="bg-orange-100 rounded-full p-3">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Dynamics Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Динамика регистраций (последние 30 дней)</h3>
          <div v-if="chartData && chartOptions" class="h-80">
            <Line :data="chartData" :options="chartOptions" />
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-500">
            <p>Нет данных для отображения</p>
          </div>
        </div>

        <!-- Contacts Dynamics Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Динамика обращений (последние 30 дней)</h3>
          <div v-if="contactsChartData && contactsChartOptions" class="h-80">
            <Line :data="contactsChartData" :options="contactsChartOptions" />
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-500">
            <p>Нет данных для отображения</p>
          </div>
        </div>

        <!-- Applications by Category -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-600">Стартапы</h4>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Starter</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.byCategory?.starter || 0 }}</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-600">Активный бизнес</h4>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.byCategory?.active || 0 }}</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-600">IT проекты</h4>
              <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">IT</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.byCategory?.it || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Settings Tab - Application Period -->
      <div v-else-if="activeTab === 'settings'" class="space-y-6">
        <!-- Current Status -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Текущий статус периода</h3>
          <div v-if="settingsLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="text-gray-500 mt-2">Загрузка...</p>
          </div>
          <div v-else-if="periodSettings" class="space-y-4">
            <div class="flex items-center gap-3">
              <span v-if="periodStatus?.isActive" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Период активен
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                Период неактивен
              </span>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Начало периода</p>
                  <p class="text-lg font-semibold text-gray-900">{{ formatSettingsDate(periodSettings.start_date) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Окончание периода</p>
                  <p class="text-lg font-semibold text-gray-900">{{ formatSettingsDate(periodSettings.end_date) }}</p>
                </div>
              </div>
              <div v-if="periodStatus?.message" class="mt-4 pt-4 border-t">
                <p class="text-sm text-gray-600">Сообщение пользователям:</p>
                <p class="text-gray-900 mt-1">{{ periodStatus.message }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Настройки периода не установлены
          </div>
        </div>

        <!-- Update Period Form -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Изменить период подачи заявок</h3>
          <form @submit.prevent="handleUpdatePeriod" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Дата начала
                </label>
                <input
                  v-model="periodForm.start_date"
                  type="datetime-local"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  v-model="periodForm.end_date"
                  type="datetime-local"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div v-if="settingsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-700 text-sm">{{ settingsError }}</p>
            </div>

            <div v-if="settingsSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-700 text-sm">Настройки периода успешно обновлены!</p>
            </div>

            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="settingsLoading"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ settingsLoading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
              <button
                type="button"
                @click="resetPeriodForm"
                class="btn-secondary"
              >
                Сбросить
              </button>
            </div>
          </form>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 class="font-semibold text-blue-900 mb-2">ℹ️ Информация</h4>
          <ul class="text-sm text-blue-800 space-y-2">
            <li>• Регистрация и вход пользователей будут заблокированы вне указанного периода</li>
            <li>• Пользователи увидят информативное сообщение с указанием дат периода</li>
            <li>• Изменения вступают в силу немедленно</li>
            <li>• Убедитесь, что даты указаны правильно перед сохранением</li>
          </ul>
        </div>
      </div>

      <!-- Templates Tab -->
      <div v-else-if="activeTab === 'templates'" class="space-y-6">
        <!-- Upload Template Form -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Загрузить шаблон бизнес-плана</h3>
          <form @submit.prevent="handleUploadTemplate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Название шаблона</label>
              <input
                v-model="templateForm.name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Шаблон бизнес-плана 2025"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Файл шаблона (PDF, DOC, DOCX)</label>
              <input
                type="file"
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <p class="text-sm text-gray-500 mt-1">Максимальный размер: 20 МБ</p>
            </div>
            <div v-if="templateError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {{ templateError }}
            </div>
            <div v-if="uploadSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
              Шаблон успешно загружен!
            </div>
            <button
              type="submit"
              :disabled="templateLoading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ templateLoading ? 'Загрузка...' : 'Загрузить шаблон' }}
            </button>
          </form>
        </div>

        <!-- Current Template -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Текущий шаблон</h3>
          <div v-if="currentTemplate" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ currentTemplate.name }}</p>
              <p class="text-sm text-gray-500">{{ currentTemplate.fileName }}</p>
              <p class="text-xs text-gray-400 mt-1">
                Загружен: {{ new Date(currentTemplate.createdAt).toLocaleString('ru-RU') }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="downloadCurrentTemplate"
                class="btn-secondary text-sm"
              >
                Скачать
              </button>
              <button
                @click="handleDeleteTemplate"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-500">
            Шаблон не загружен
          </div>
        </div>
      </div>

      <!-- Jury Tab -->
      <div v-else-if="activeTab === 'jury'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Члены жюри</h3>
            <button @click="openJuryModal()" class="btn-primary">
              + Добавить члена жюри
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="juryLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Загрузка...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="juryError" class="text-center py-8">
            <div class="text-red-600 mb-2">Ошибка загрузки</div>
            <button @click="loadJury" class="btn-primary text-sm">Попробовать снова</button>
          </div>

          <!-- Empty State -->
          <div v-else-if="juryMembers.length === 0" class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p>Члены жюри не добавлены</p>
          </div>

          <!-- Jury Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="member in juryMembers"
              :key="member.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="{ 'opacity-50': !member.isActive }"
            >
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img
                    v-if="member.photoPath"
                    :src="getJuryPhotoUrl(member.photoPath)"
                    :alt="member.fullName"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ member.fullName }}</h4>
                  <p class="text-sm text-gray-600 truncate">{{ member.position }}</p>
                  <p v-if="member.organization" class="text-xs text-gray-500 truncate">{{ member.organization }}</p>
                  <span
                    class="inline-block mt-2 px-2 py-0.5 text-xs rounded-full"
                    :class="member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ member.isActive ? 'Активен' : 'Скрыт' }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 mt-4 pt-4 border-t">
                <button
                  @click="openJuryModal(member)"
                  class="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Редактировать
                </button>
                <button
                  @click="handleToggleJuryActive(member)"
                  class="px-3 py-1.5 text-sm rounded"
                  :class="member.isActive ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                >
                  {{ member.isActive ? 'Скрыть' : 'Показать' }}
                </button>
                <button
                  @click="handleDeleteJury(member.id)"
                  class="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Finalists Tab -->
      <div v-else-if="activeTab === 'finalists'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Финалисты конкурса</h3>
            <button @click="openFinalistModal()" class="btn-primary">
              + Добавить финалиста
            </button>
          </div>

          <!-- Filters -->
          <div class="mb-6">
            <select
              v-model="finalistCategoryFilter"
              @change="loadFinalists"
              class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все категории</option>
              <option value="starter">Стартапы</option>
              <option value="active">Активный бизнес</option>
              <option value="it">IT проекты</option>
            </select>
          </div>

          <!-- Loading State -->
          <div v-if="finalistsLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Загрузка...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="finalistsError" class="text-center py-8">
            <div class="text-red-600 mb-2">Ошибка загрузки</div>
            <button @click="loadFinalists" class="btn-primary text-sm">Попробовать снова</button>
          </div>

          <!-- Empty State -->
          <div v-else-if="finalists.length === 0" class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            <p>Финалисты не добавлены</p>
          </div>

          <!-- Finalists Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Фото</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФИО</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Проект</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Место</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="finalist in finalists"
                  :key="finalist.id"
                  class="hover:bg-gray-50"
                  :class="{ 'opacity-50': !finalist.isActive }"
                >
                  <td class="px-4 py-3">
                    <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        v-if="finalist.photoPath"
                        :src="getFinalistPhotoUrl(finalist.photoPath)"
                        :alt="finalist.fullName"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">{{ finalist.fullName }}</div>
                    <div v-if="finalist.city" class="text-xs text-gray-500">{{ finalist.city }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {{ finalist.projectName }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800': finalist.category === 'starter',
                        'bg-green-100 text-green-800': finalist.category === 'active',
                        'bg-purple-100 text-purple-800': finalist.category === 'it'
                      }"
                    >
                      {{ getCategoryLabel(finalist.category) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <span v-if="finalist.place" class="font-bold text-lg" :class="{
                        'text-yellow-500': finalist.place === 1,
                        'text-gray-400': finalist.place === 2,
                        'text-orange-600': finalist.place === 3
                      }">
                        {{ finalist.place }}
                      </span>
                      <span v-else class="text-gray-400">—</span>
                      <span v-if="finalist.isWinner" class="ml-1">
                        <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-0.5 text-xs rounded-full"
                      :class="finalist.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ finalist.isActive ? 'Активен' : 'Скрыт' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button
                        @click="openFinalistModal(finalist)"
                        class="text-blue-600 hover:text-blue-800"
                        title="Редактировать"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="handleToggleFinalistActive(finalist)"
                        :class="finalist.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                        :title="finalist.isActive ? 'Скрыть' : 'Показать'"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="finalist.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteFinalist(finalist.id)"
                        class="text-red-600 hover:text-red-800"
                        title="Удалить"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </main>
    </div>

    <!-- Application Details Modal -->
    <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="selectedApplication = null">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-900">Детали заявки</h2>
          <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- User Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-3">Информация о пользователе</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Email:</span>
                <span class="ml-2 text-gray-900">{{ selectedApplication.user?.email }}</span>
              </div>
              <div>
                <span class="text-gray-500">Имя:</span>
                <span class="ml-2 text-gray-900">{{ selectedApplication.user?.profile?.fullName || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Телефон:</span>
                <span class="ml-2 text-gray-900">{{ selectedApplication.user?.profile?.phone || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Город:</span>
                <span class="ml-2 text-gray-900">{{ selectedApplication.user?.profile?.city || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Application Details -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">Категория</label>
            <p class="text-lg font-medium text-gray-900">{{ getCategoryLabel(selectedApplication.category) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">Описание бизнеса</label>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-900 whitespace-pre-wrap">{{ selectedApplication.summary }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">Бизнес-план</label>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  :class="selectedApplication.planFilePath ? 'text-green-600' : 'text-gray-400'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span :class="selectedApplication.planFilePath ? 'text-green-600 font-medium' : 'text-gray-500'">
                  {{ selectedApplication.planFilePath ? 'Файл загружен' : 'Файл не загружен' }}
                </span>
              </div>
              <a
                v-if="selectedApplication.planFilePath"
                :href="`${apiUrl.replace('/api', '')}/${selectedApplication.planFilePath}`"
                download
                target="_blank"
                class="btn-primary text-sm inline-flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Скачать файл
              </a>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Дата создания</label>
              <p class="text-gray-900">{{ new Date(selectedApplication.createdAt).toLocaleString('ru-RU') }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Последнее обновление</label>
              <p class="text-gray-900">{{ new Date(selectedApplication.updatedAt).toLocaleString('ru-RU') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Details Modal -->
    <div v-if="selectedContact" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="selectedContact = null">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-900">Обращение от пользователя</h2>
          <button @click="selectedContact = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Contact Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-3">Информация об отправителе</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Имя:</span>
                <span class="ml-2 text-gray-900">{{ selectedContact.name }}</span>
              </div>
              <div>
                <span class="text-gray-500">Email:</span>
                <a :href="`mailto:${selectedContact.email}`" class="ml-2 text-blue-600 hover:underline">
                  {{ selectedContact.email }}
                </a>
              </div>
              <div class="col-span-2">
                <span class="text-gray-500">Дата отправки:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(selectedContact.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Message Content -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">Обращение</label>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-900 whitespace-pre-wrap">{{ selectedContact.message }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <a
              :href="`mailto:${selectedContact.email}?subject=Ответ на ваше обращение&body=Здравствуйте, ${selectedContact.name}!%0A%0AСпасибо за ваше обращение:%0A%0A${selectedContact.message}%0A%0A---%0AОтвет:%0A`"
              class="btn-primary text-sm inline-flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Ответить
            </a>
            <button
              @click="selectedContact = null"
              class="btn-secondary text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Jury Modal -->
    <div v-if="showJuryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeJuryModal">
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingJury ? 'Редактировать члена жюри' : 'Добавить члена жюри' }}
          </h2>
          <button @click="closeJuryModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSaveJury" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ФИО *</label>
            <input
              v-model="juryForm.fullName"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Должность *</label>
            <input
              v-model="juryForm.position"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Организация</label>
            <input
              v-model="juryForm.organization"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Биография</label>
            <textarea
              v-model="juryForm.bio"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Фото</label>
            <input
              type="file"
              @change="handleJuryPhotoSelect"
              accept="image/jpeg,image/png,image/webp"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">JPEG, PNG или WebP. Макс. 5 МБ</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="juryForm.isActive"
              type="checkbox"
              id="juryIsActive"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label for="juryIsActive" class="text-sm text-gray-700">Активен (виден на сайте)</label>
          </div>

          <div v-if="juryError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {{ juryError }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="juryLoading"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ juryLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              type="button"
              @click="closeJuryModal"
              class="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Finalist Modal -->
    <div v-if="showFinalistModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeFinalistModal">
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingFinalist ? 'Редактировать финалиста' : 'Добавить финалиста' }}
          </h2>
          <button @click="closeFinalistModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSaveFinalist" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ФИО *</label>
            <input
              v-model="finalistForm.fullName"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Название проекта *</label>
            <input
              v-model="finalistForm.projectName"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Категория *</label>
            <select
              v-model="finalistForm.category"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="starter">Стартап</option>
              <option value="active">Активный бизнес</option>
              <option value="it">IT проект</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Город</label>
            <input
              v-model="finalistForm.city"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Описание проекта</label>
            <textarea
              v-model="finalistForm.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Место</label>
              <input
                v-model.number="finalistForm.place"
                type="number"
                min="1"
                max="10"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1, 2, 3..."
              />
            </div>
            <div class="flex items-end">
              <div class="flex items-center gap-2">
                <input
                  v-model="finalistForm.isWinner"
                  type="checkbox"
                  id="finalistIsWinner"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label for="finalistIsWinner" class="text-sm text-gray-700">Победитель</label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Фото</label>
            <input
              type="file"
              @change="handleFinalistPhotoSelect"
              accept="image/jpeg,image/png,image/webp"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">JPEG, PNG или WebP. Макс. 5 МБ</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="finalistForm.isActive"
              type="checkbox"
              id="finalistIsActive"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label for="finalistIsActive" class="text-sm text-gray-700">Активен (виден на сайте)</label>
          </div>

          <div v-if="finalistsError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {{ finalistsError }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="finalistsLoading"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ finalistsLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              type="button"
              @click="closeFinalistModal"
              class="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

definePageMeta({
  middleware: 'admin',
  layout: false
})

const { user, logout } = useAuth()
const { applications, users, contacts, stats, loading, error, getAllApplications, updateApplicationStatus, getAllUsers, getStats, getAllContacts, getContactById, exportApplications, exportUsers } = useAdmin()
const { activeTemplate, uploadTemplate, getActiveTemplate, downloadTemplate, deleteTemplate } = useTemplate()
const { settings: periodSettings, periodStatus, loading: settingsLoading, error: settingsError, getApplicationSettings, updateApplicationSettings, formatDateForInput, formatDate: formatSettingsDate } = useSettings()
const { juryMembers, loading: juryLoading, error: juryError, getAllJuryMembers, createJuryMember, updateJuryMember, deleteJuryMember, uploadJuryPhoto, getPhotoUrl: getJuryPhotoUrl } = useJury()
const { finalists, loading: finalistsLoading, error: finalistsError, getAllFinalists, createFinalist, updateFinalist, deleteFinalist, uploadFinalistPhoto, getPhotoUrl: getFinalistPhotoUrl, getCategoryLabel } = useFinalist()

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const activeTab = ref<'applications' | 'users' | 'templates' | 'contacts' | 'stats' | 'settings' | 'jury' | 'finalists'>('applications')
const filters = ref({
  status: 'submitted' as '' | 'draft' | 'submitted',
  category: '' as '' | 'starter' | 'active' | 'it',
  page: 1,
  limit: 20
})
const pagination = ref<{ page: number; limit: number; total: number; pages: number } | null>(null)
const contactPagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const userPagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const selectedApplication = ref<any>(null)
const selectedContact = ref<any>(null)

// User filters state
const userFilters = ref({
  search: '',
  role: '' as '' | 'user' | 'admin',
  emailVerified: '' as '' | 'true' | 'false',
  page: 1,
  limit: 20
})

// Template state
const currentTemplate = ref<any>(null)
const templateForm = ref({
  name: '',
  file: null as File | null
})
const templateLoading = ref(false)
const templateError = ref<string | null>(null)
const uploadSuccess = ref(false)

// Settings state
const periodForm = ref({
  start_date: '',
  end_date: ''
})
const settingsSuccess = ref(false)

// Jury state
const showJuryModal = ref(false)
const editingJury = ref<any>(null)
const juryForm = ref({
  fullName: '',
  position: '',
  organization: '',
  bio: '',
  isActive: true
})
const juryPhotoFile = ref<File | null>(null)

// Finalists state
const showFinalistModal = ref(false)
const editingFinalist = ref<any>(null)
const finalistForm = ref({
  fullName: '',
  projectName: '',
  category: 'starter' as 'starter' | 'active' | 'it',
  city: '',
  description: '',
  place: null as number | null,
  isWinner: false,
  isActive: true
})
const finalistPhotoFile = ref<File | null>(null)
const finalistCategoryFilter = ref<'' | 'starter' | 'active' | 'it'>('')

// Export state
const exportLoading = ref(false)
const exportSuccess = ref(false)
const exportError = ref<string | null>(null)

// Chart data and options
const chartData = computed(() => {
  if (!stats.value?.registrationsByDay || stats.value.registrationsByDay.length === 0) {
    return null
  }

  const labels = stats.value.registrationsByDay.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
  })

  const data = stats.value.registrationsByDay.map(item => item.count)

  return {
    labels,
    datasets: [
      {
        label: 'Регистрации',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }
})

// Contacts chart data
const contactsChartData = computed(() => {
  if (!stats.value?.contactsByDay || stats.value.contactsByDay.length === 0) {
    return null
  }

  const labels = stats.value.contactsByDay.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
  })

  const data = stats.value.contactsByDay.map(item => item.count)

  return {
    labels,
    datasets: [
      {
        label: 'Обращения',
        data,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function(context: any) {
          return `Регистраций: ${context.parsed.y}`
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 0,
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}))

// Contacts chart options (separate for different tooltip text)
const contactsChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function(context: any) {
          return `Обращений: ${context.parsed.y}`
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 0,
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}))

// Load data on mount
onMounted(async () => {
  await loadData()
})

// Watch activeTab to load appropriate data
watch(activeTab, async (newTab) => {
  if (newTab === 'applications' && applications.value.length === 0) {
    await loadApplications()
  } else if (newTab === 'users' && users.value.length === 0) {
    await loadUsers()
  } else if (newTab === 'templates' && !currentTemplate.value) {
    await loadTemplate()
  } else if (newTab === 'settings' && !periodSettings.value) {
    await loadSettings()
  } else if (newTab === 'stats' && !stats.value) {
    await getStats()
  } else if (newTab === 'jury' && juryMembers.value.length === 0) {
    await loadJury()
  } else if (newTab === 'finalists' && finalists.value.length === 0) {
    await loadFinalists()
  }
})

const loadData = async () => {
  if (activeTab.value === 'applications') {
    await loadApplications()
  } else if (activeTab.value === 'users') {
    await loadUsers()
  } else if (activeTab.value === 'templates') {
    await loadTemplate()
  }
}

const loadTemplate = async () => {
  const template = await getActiveTemplate()
  currentTemplate.value = template
}

const loadApplications = async () => {
  try {
    const params: any = {
      page: filters.value.page,
      limit: filters.value.limit
    }
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.category) params.category = filters.value.category

    const response = await getAllApplications(params)
    pagination.value = response.pagination
  } catch (err) {
    console.error('Failed to load applications:', err)
  }
}

const loadUsers = async () => {
  try {
    const params: any = {
      page: userFilters.value.page,
      limit: userFilters.value.limit
    }
    if (userFilters.value.search) params.search = userFilters.value.search
    if (userFilters.value.role) params.role = userFilters.value.role
    if (userFilters.value.emailVerified) params.emailVerified = userFilters.value.emailVerified === 'true'

    const response = await getAllUsers(params)
    userPagination.value = response.pagination
  } catch (err) {
    console.error('Failed to load users:', err)
  }
}

const resetUserFilters = () => {
  userFilters.value = {
    search: '',
    role: '',
    emailVerified: '',
    page: 1,
    limit: 20
  }
  loadUsers()
}

const changeUserPage = (page: number) => {
  userFilters.value.page = page
  loadUsers()
}

const resetFilters = () => {
  filters.value = {
    status: 'submitted',
    category: '',
    page: 1,
    limit: 20
  }
  loadApplications()
}

const changePage = (page: number) => {
  filters.value.page = page
  loadApplications()
}

const viewApplication = (app: any) => {
  selectedApplication.value = app
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    starter: 'Стартап',
    active: 'Активный бизнес',
    it: 'IT проект'
  }
  return labels[category] || category
}

const loadContacts = async (page: number = 1) => {
  try {
    const response = await getAllContacts({
      page,
      limit: 20
    })
    contactPagination.value = response.pagination
  } catch (err) {
    console.error('Failed to load contacts:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = async () => {
  await logout()
}

// Template handlers
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    templateForm.value.file = target.files[0]
  }
}

const handleUploadTemplate = async () => {
  if (!templateForm.value.name || !templateForm.value.file) return

  templateLoading.value = true
  templateError.value = null
  uploadSuccess.value = false

  try {
    await uploadTemplate(templateForm.value.file, templateForm.value.name)
    uploadSuccess.value = true

    // Reset form
    templateForm.value = { name: '', file: null }
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    // Reload template
    await loadTemplate()
  } catch (err: any) {
    templateError.value = err.data?.error || 'Не удалось загрузить шаблон'
  } finally {
    templateLoading.value = false
  }
}

const downloadCurrentTemplate = () => {
  if (currentTemplate.value) {
    downloadTemplate(currentTemplate.value)
  }
}

const handleDeleteTemplate = async () => {
  if (!currentTemplate.value) return

  if (!confirm('Вы уверены, что хотите удалить текущий шаблон?')) return

  try {
    await deleteTemplate(currentTemplate.value.id)
    currentTemplate.value = null
  } catch (err) {
    alert('Не удалось удалить шаблон')
  }
}

// Settings handlers
const loadSettings = async () => {
  try {
    await getApplicationSettings()
    if (periodSettings.value) {
      periodForm.value.start_date = formatDateForInput(periodSettings.value.start_date)
      periodForm.value.end_date = formatDateForInput(periodSettings.value.end_date)
    }
  } catch (err) {
    console.error('Failed to load settings:', err)
  }
}

const handleUpdatePeriod = async () => {
  settingsSuccess.value = false

  try {
    // Convert local datetime to ISO string
    const startDate = new Date(periodForm.value.start_date).toISOString()
    const endDate = new Date(periodForm.value.end_date).toISOString()

    await updateApplicationSettings(startDate, endDate)
    settingsSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      settingsSuccess.value = false
    }, 3000)
  } catch (err: any) {
    console.error('Failed to update settings:', err)
  }
}

const resetPeriodForm = () => {
  if (periodSettings.value) {
    periodForm.value.start_date = formatDateForInput(periodSettings.value.start_date)
    periodForm.value.end_date = formatDateForInput(periodSettings.value.end_date)
  }
  settingsSuccess.value = false
}

// Jury handlers
const loadJury = async () => {
  try {
    await getAllJuryMembers()
  } catch (err) {
    console.error('Failed to load jury:', err)
  }
}

const openJuryModal = (member?: any) => {
  if (member) {
    editingJury.value = member
    juryForm.value = {
      fullName: member.fullName,
      position: member.position,
      organization: member.organization || '',
      bio: member.bio || '',
      isActive: member.isActive
    }
  } else {
    editingJury.value = null
    juryForm.value = {
      fullName: '',
      position: '',
      organization: '',
      bio: '',
      isActive: true
    }
  }
  juryPhotoFile.value = null
  showJuryModal.value = true
}

const closeJuryModal = () => {
  showJuryModal.value = false
  editingJury.value = null
  juryPhotoFile.value = null
}

const handleJuryPhotoSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    juryPhotoFile.value = target.files[0]
  }
}

const handleSaveJury = async () => {
  try {
    let member
    if (editingJury.value) {
      member = await updateJuryMember(editingJury.value.id, juryForm.value)
    } else {
      member = await createJuryMember(juryForm.value)
    }

    // Загрузить фото если выбрано
    if (juryPhotoFile.value && member) {
      await uploadJuryPhoto(member.id, juryPhotoFile.value)
    }

    await loadJury()
    closeJuryModal()
  } catch (err) {
    console.error('Failed to save jury member:', err)
  }
}

const handleDeleteJury = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить этого члена жюри?')) return

  try {
    await deleteJuryMember(id)
  } catch (err) {
    console.error('Failed to delete jury member:', err)
  }
}

const handleToggleJuryActive = async (member: any) => {
  try {
    await updateJuryMember(member.id, { isActive: !member.isActive })
    await loadJury()
  } catch (err) {
    console.error('Failed to toggle jury active:', err)
  }
}

// Finalists handlers
const loadFinalists = async () => {
  try {
    const filters: any = {}
    if (finalistCategoryFilter.value) {
      filters.category = finalistCategoryFilter.value
    }
    await getAllFinalists(filters)
  } catch (err) {
    console.error('Failed to load finalists:', err)
  }
}

const openFinalistModal = (finalist?: any) => {
  if (finalist) {
    editingFinalist.value = finalist
    finalistForm.value = {
      fullName: finalist.fullName,
      projectName: finalist.projectName,
      category: finalist.category,
      city: finalist.city || '',
      description: finalist.description || '',
      place: finalist.place,
      isWinner: finalist.isWinner,
      isActive: finalist.isActive
    }
  } else {
    editingFinalist.value = null
    finalistForm.value = {
      fullName: '',
      projectName: '',
      category: 'starter',
      city: '',
      description: '',
      place: null,
      isWinner: false,
      isActive: true
    }
  }
  finalistPhotoFile.value = null
  showFinalistModal.value = true
}

const closeFinalistModal = () => {
  showFinalistModal.value = false
  editingFinalist.value = null
  finalistPhotoFile.value = null
}

const handleFinalistPhotoSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    finalistPhotoFile.value = target.files[0]
  }
}

const handleSaveFinalist = async () => {
  try {
    let finalist
    if (editingFinalist.value) {
      finalist = await updateFinalist(editingFinalist.value.id, finalistForm.value)
    } else {
      finalist = await createFinalist(finalistForm.value)
    }

    // Загрузить фото если выбрано
    if (finalistPhotoFile.value && finalist) {
      await uploadFinalistPhoto(finalist.id, finalistPhotoFile.value)
    }

    await loadFinalists()
    closeFinalistModal()
  } catch (err) {
    console.error('Failed to save finalist:', err)
  }
}

const handleDeleteFinalist = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить этого финалиста?')) return

  try {
    await deleteFinalist(id)
  } catch (err) {
    console.error('Failed to delete finalist:', err)
  }
}

const handleToggleFinalistActive = async (finalist: any) => {
  try {
    await updateFinalist(finalist.id, { isActive: !finalist.isActive })
    await loadFinalists()
  } catch (err) {
    console.error('Failed to toggle finalist active:', err)
  }
}

// Export handlers
const handleExportApplications = async () => {
  exportLoading.value = true
  exportError.value = null
  exportSuccess.value = false

  try {
    await exportApplications()
    exportSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      exportSuccess.value = false
    }, 3000)
  } catch (err: any) {
    exportError.value = err.message || 'Не удалось экспортировать заявки'
    alert('Ошибка экспорта: ' + exportError.value)
  } finally {
    exportLoading.value = false
  }
}

const handleExportUsers = async () => {
  exportLoading.value = true
  exportError.value = null
  exportSuccess.value = false

  try {
    await exportUsers()
    exportSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      exportSuccess.value = false
    }, 3000)
  } catch (err: any) {
    exportError.value = err.message || 'Не удалось экспортировать пользователей'
    alert('Ошибка экспорта: ' + exportError.value)
  } finally {
    exportLoading.value = false
  }
}

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'contacts' && contacts.value.length === 0) {
    loadContacts()
  }
})

// Debounce for user search filter
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(() => userFilters.value.search, () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  searchDebounceTimer = setTimeout(() => {
    userFilters.value.page = 1 // Reset to first page on new search
    loadUsers()
  }, 500) // 500ms delay
})

useSeoMeta({
  title: 'Админ-панель - Business Qoldau 2025',
  description: 'Панель администратора',
  robots: 'noindex, nofollow'
})
</script>
