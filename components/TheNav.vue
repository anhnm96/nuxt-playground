<template>
  <nav
    class="border-base flex items-center justify-between gap-1 border px-4 py-3 text-lg"
  >
    <NuxtLink to="/" class="flex items-baseline gap-1 text-xl font-bold">
      <Icon name="i-logos-nuxt-icon" />
      <span
        class="animated-gradient-text"
        style="
          --animated-gradient-color-one: #5f8589;
          --animated-gradient-color-two: #42d392;
        "
        >Nuxt Playground</span
      >
    </NuxtLink>
    <div class="flex items-center gap-1">
      <ColorSchemeToggle />
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
