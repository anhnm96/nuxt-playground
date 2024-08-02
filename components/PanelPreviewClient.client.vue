<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()
const colorMode = useColorMode()

const iframe = ref<HTMLIFrameElement>()

function onIframeLoad() {
  syncColorMode()
}

function syncColorMode() {
  iframe.value?.contentWindow?.postMessage(
    {
      type: 'color-mode',
      mode: colorMode.value,
    },
    '*',
  )
}
watch(colorMode, syncColorMode, { flush: 'sync' })

onMounted(() => {
  mountPlayground(play, colorMode.value)
})

defineExpose({
  iframe,
})
</script>

<template>
  <iframe
    v-if="play.previewUrl"
    ref="iframe"
    class="h-full w-full"
    :class="{ 'pointer-events-none': ui.isPanelDragging }"
    :src="play.previewUrl"
    :style="
      play.status === 'ready' ? '' : 'opacity: 0.001; pointer-events: none;'
    "
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
    @load="onIframeLoad"
  />
</template>
