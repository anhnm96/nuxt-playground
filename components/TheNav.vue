<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()
const runtime = useRuntimeConfig()

const buildTime = new Date(runtime.public.buildTime as number)
const timeAgo = useTimeAgo(buildTime)
</script>

<template>
  <nav
    class="border-base flex items-center justify-between gap-1 border px-4 py-3 text-lg"
  >
    <div class="flex items-baseline gap-1">
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
      <ClientOnly>
        <time
          class="text-sm opacity-50"
          :datetime="buildTime.toISOString()"
          :title="buildTime.toLocaleString()"
        >
          Built {{ timeAgo }}
        </time>
      </ClientOnly>
    </div>
    <div class="flex items-center gap-1">
      <button
        v-if="play.status === 'ready' && play.features.download !== false"
        class="hover:bg-active flex rounded p-2"
        title="Download as ZIP"
        @click="play.downloadZip()"
      >
        <Icon name="i-ph-download-duotone" class="text-2xl" />
      </button>
      <button
        v-if="play.features.terminal !== false"
        class="hover:bg-active flex rounded p-2"
        :class="ui.showTerminal ? '' : 'opacity-50'"
        title="Toggle terminal"
        @click="ui.toggleTerminal()"
      >
        <Icon name="i-ph-terminal-window-duotone" class="text-2xl" />
      </button>
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
