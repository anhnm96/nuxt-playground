<script lang="ts" setup>
const play = usePlaygroundStore()
function getStep(status: PlaygroundStatus) {
  if (status === 'error' || play.status === 'error') return 'error'
  const indexCurrent = PlaygroundStatusOrder.indexOf(play.status)
  const index = PlaygroundStatusOrder.indexOf(status)
  if (indexCurrent === index) return 'current'
  if (indexCurrent > index) return 'done'
  return 'todo'
}
function getStatusIcon(status: PlaygroundStatus) {
  const step = getStep(status)
  switch (step) {
    case 'error':
      return { icon: 'i-ph-x-circle-duotone', class: 'text-error text-xl' }
    case 'current':
      return {
        icon: 'i-svg-spinners-90-ring-with-bg',
        class: 'scale-95 text-xl',
      }
    case 'done':
      return {
        icon: 'i-ph-check-circle-duotone',
        class: 'text-primary text-xl',
      }
    case 'todo':
      return { icon: 'i-ph-dot-duotone', class: 'text-xl' }
  }
}
function getTextClass(status: PlaygroundStatus) {
  const step = getStep(status)
  switch (step) {
    case 'error':
      return 'text-red'
    case 'current':
      return ''
    case 'done':
      return 'text-primary'
    case 'todo':
      return 'opacity-50'
  }
}
</script>

<template>
  <div
    v-if="play.status !== 'ready'"
    class="flex h-full flex-col items-center justify-center capitalize"
  >
    <div
      class="grid grid-cols-[max-content_1fr] items-center justify-center gap-2"
    >
      <Icon
        :class="getStatusIcon('init').class"
        :name="getStatusIcon('init').icon"
      />
      <span :class="getTextClass('init')">Initialize WebContainer</span>
      <Icon
        :class="getStatusIcon('mount').class"
        :name="getStatusIcon('mount').icon"
      />
      <span :class="getTextClass('mount')">Mount files</span>
      <Icon
        :class="getStatusIcon('install').class"
        :name="getStatusIcon('install').icon"
      />
      <span :class="getTextClass('install')">Install Dependencies</span>
      <Icon
        :class="getStatusIcon('start').class"
        :name="getStatusIcon('start').icon"
      />
      <span :class="getTextClass('start')">Boot Nuxt Server</span>
    </div>
  </div>
</template>
