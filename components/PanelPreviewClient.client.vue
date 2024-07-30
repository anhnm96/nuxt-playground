<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()

const iframe = ref<HTMLIFrameElement>()

onMounted(() => {
  mountPlayground(play)
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
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
</template>
