<script setup lang="ts">
const { x, y } = useMouse()
const color = useColorMode()
</script>

<template>
  <main class="h-screen w-screen overflow-hidden">
    <TheNav />
    {{ x }} {{ y }}
    {{ color }}
    <button @click="color.value = color.value === 'dark' ? 'light' : 'dark'">
      {{ color.value }}
    </button>
  </main>
</template>

<style>
.dark {
  color-scheme: dark;
}
</style>
