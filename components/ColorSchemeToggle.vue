<script lang="ts" setup>
const colorMode = useColorMode()
function toggleMode() {
  return (colorMode.value = colorMode.value === 'light' ? 'dark' : 'light')
}
</script>

<template>
  <button class="hover:bg-active flex rounded p-2 text-2xl" @click="toggleMode">
    <Icon
      :name="
        colorMode.value === 'light'
          ? 'i-ph-sun-dim-duotone'
          : 'i-ph-moon-stars-duotone'
      "
    />
  </button>
</template>
