<script lang="ts">
const FILE_ICONS = [
  {
    match: /\.vue$/,
    icon: { name: 'i-catppuccin-vue' },
  },
  {
    match: /nuxt\.config\.\w+$/,
    icon: { name: 'i-catppuccin-nuxt' },
  },
  {
    match: /package\.json$/,
    icon: { name: 'i-catppuccin-npm' },
  },
  {
    match: /\.[mc]?tsx?$/,
    icon: { name: 'i-catppuccin-typescript' },
  },
  {
    match: /\.[mc]?jsx?$/,
    icon: { name: 'i-catppuccin-javascript' },
  },
]
</script>

<script setup lang="ts">
const props = defineProps<{
  path: string
  isDirectory?: boolean
  isDirectoryOpen?: boolean
}>()

const icon = computed(() => {
  if (props.isDirectory) {
    return props.isDirectoryOpen
      ? { name: 'i-catppuccin-folder-open' }
      : { name: 'i-catppuccin-folder' }
  }
  for (const { match, icon } of FILE_ICONS) {
    if (match.test(props.path)) return icon
  }
  return { name: 'i-catppuccin-file' }
})

const colorMode = useColorMode()
const cls = computed(() => {
  return colorMode.value === 'light'
    ? 'brightness-[.6] hue-rotate-180 invert saturate-200'
    : ''
})
</script>

<template>
  <Icon class="scale-110" :class="[cls]" :name="icon.name" />
</template>
