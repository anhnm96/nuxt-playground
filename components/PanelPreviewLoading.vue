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
      return 'animate-pulse'
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
    class="flex h-full flex-col items-center justify-center gap-2"
  >
    <template v-if="play.status === 'interactive'">
      <div class="flex items-center gap-2 text-lg">
        <Icon name="i-ph-terminal-window-duotone" class="text-2xl" />
        Interactive terminal mode
      </div>
      <button
        title="Restart terminal"
        class="hover:bg-active mx-1 flex items-center gap-1 rounded px-1 opacity-50 hover:text-blue-500 hover:opacity-100"
        @click="play.restartServer()"
      >
        <Icon class="text-lg" name="i-ph-arrow-clockwise-duotone" />
        Restart the server
      </button>
    </template>
    <div
      v-else
      class="grid grid-cols-[max-content_1fr] items-center justify-center gap-2"
    >
      <Icon
        :class="getStatusIcon('init').class"
        :name="getStatusIcon('init').icon"
      />
      <span :class="getTextClass('init')">Initializing WebContainer</span>
      <Icon
        :class="getStatusIcon('mount').class"
        :name="getStatusIcon('mount').icon"
      />
      <span :class="getTextClass('mount')">Mounting files</span>
      <Icon
        :class="getStatusIcon('install').class"
        :name="getStatusIcon('install').icon"
      />
      <span :class="getTextClass('install')">Installing Dependencies</span>
      <Icon
        :class="getStatusIcon('start').class"
        :name="getStatusIcon('start').icon"
      />
      <span :class="getTextClass('start')">Starting Nuxt Server</span>
      <Icon
        :class="getStatusIcon('polling').class"
        :name="getStatusIcon('polling').icon"
      />
      <span :class="getTextClass('polling')">Waiting for Nuxt to ready</span>
    </div>
  </div>
</template>
