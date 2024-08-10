<script lang="ts">
const FILE_ICONS = [
  {
    match: /\.vue$/,
    icon: { name: 'i-logos-vue' },
  },
  {
    match: /nuxt\.config\.\w+$/,
    icon: { name: 'i-logos-nuxt-icon ', class: 'scale-110' },
  },
  {
    match: /package\.json$/,
    icon: { name: 'i-file-icons-npm', class: 'text-red-500 scale-110' },
  },
  {
    match: /\.[mc]?tsx?$/,
    icon: { name: 'i-file-icons-typescript-alt', class: 'text-blue-500' },
  },
  {
    match: /\.[mc]?jsx?$/,
    icon: { name: 'i-devicon-javascript' },
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
      ? { name: 'ph:folder-open-duotone', class: 'scale-120' }
      : { name: 'ph:folder-simple-duotone', class: 'scale-120' }
  }
  for (const { match, icon } of FILE_ICONS) {
    if (match.test(props.path)) return icon
  }
  return { name: 'ph:file-duotone', class: 'scale-120' }
})
</script>

<template>
  <Icon :class="icon.class" :name="icon.name" />
</template>
