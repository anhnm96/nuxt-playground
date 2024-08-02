<script setup lang="ts">
if (process.client) {
  const route = useRoute()
  watch(
    () => route.fullPath,
    (newFullPath) => {
      window.parent.postMessage(
        {
          type: 'update:path',
          path: newFullPath,
        },
        '*',
      )
    },
    { immediate: true },
  )

  window.parent.postMessage(
    {
      type: 'ready',
    },
    '*',
  )

  window.addEventListener('message', (event) => {
    switch (event.data.type) {
      case 'color-mode':
        document.documentElement.classList.toggle(
          'dark',
          event.data.mode === 'dark',
        )
        break
      default:
        break
    }
  })
}
</script>

<template>
  <NuxtWelcome />
</template>

<style>
html.dark {
  color-scheme: dark;
  background: #020420;
}
</style>
