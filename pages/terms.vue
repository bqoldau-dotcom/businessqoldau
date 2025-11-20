<template>
  <div class="py-16">
    <div class="container-custom">
      <div class="max-w-4xl mx-auto">
        <h1 class="mb-8">{{ $t('terms.title') }}</h1>
        <div class="prose prose-lg max-w-none">
          <ContentDoc path="/terms" />
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
  title: t('terms.metaTitle'),
  description: t('terms.metaDescription'),
})
</script>