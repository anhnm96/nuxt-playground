<script setup lang="ts"></script>

<template>
  <div class="bg-base h-screen w-screen overflow-hidden">
    <TheNav />
    <main class="flex h-full">
      <article class="border-base prose w-1/3 border-r">
        <ContentDoc />
      </article>
      <div class="w-2/3">
        <ThePlayground />
      </div>
    </main>
  </div>
</template>
