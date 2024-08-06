<script setup lang="ts"></script>

<template>
  <div class="grid h-full grid-rows-[min-content_1fr]">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-book-duotone" />
      <span class="text-sm">Guide</span>
    </div>
    <article class="prose max-w-none overflow-auto dark:prose-invert">
      <ContentDoc />
    </article>
  </div>
</template>
