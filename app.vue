<script setup lang="ts">
const { x, y } = useMouse()
const color = useColorMode()
</script>

<template>
  <div class="bg-red-500">
    {{ x }} {{ y }}
    {{ color }}
    <button @click="color.value = color.value === 'dark' ? 'light' : 'dark'">
      {{ color.value }}
    </button>
  </div>
</template>

<style>
.dark {
  color-scheme: dark;
}
</style>
