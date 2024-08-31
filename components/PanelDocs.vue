<script setup lang="ts">
const { page } = useContent()
const sourceUrl = computed(
  () =>
    `https://github.com/xiaosasori/nuxt-playground/edit/main/content/${page.value._file}`,
)
</script>

<template>
  <div class="grid h-full grid-rows-[min-content_1fr_min-content]">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-book-duotone" />
      <span class="text-sm">Guide</span>
    </div>
    <article class="prose max-w-none overflow-auto dark:prose-invert">
      <ContentDoc />
    </article>
    <div class="border-base border-t border-dashed px-6 py-2">
      <NuxtLink
        :to="sourceUrl"
        target="_blank"
        class="flex items-center gap-2 opacity-50 hover:text-primary hover:opacity-100"
      >
        <Icon name="i-ph-note-pencil-duotone" />
        Edit this page
      </NuxtLink>
    </div>
  </div>
</template>
