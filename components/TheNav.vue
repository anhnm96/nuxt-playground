<template>
  <nav
    class="border-base flex items-center justify-between gap-1 border px-4 py-3 text-lg"
  >
    <div>
      <Icon name="i-logos-nuxt-icon" />
      Nuxt Playground
    </div>
    <div class="flex items-center gap-1">
      <NuxtLink
        class="hover:bg-active flex rounded p-2"
        title="GitHub"
        href="https://github.com/xiaosasori/nuxt-playground"
        target="_blank"
      >
        <Icon name="i-carbon-logo-github" class="text-2xl" />
      </NuxtLink>
    </div>
  </nav>
</template>
