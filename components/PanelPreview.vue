<script setup lang="ts">
const play = usePlaygroundStore()

const inner = ref<{ iframe?: HTMLIFrameElement | undefined }>()
const inputUrl = ref<string>('')
// auto update inputUrl when location value changed
syncRef(
  computed(() => play.previewLocation.fullPath),
  inputUrl,
  { direction: 'ltr' },
)
function refreshIframe() {
  if (play.previewUrl && inner.value?.iframe) {
    inner.value.iframe.src = play.previewUrl
    inputUrl.value = play.previewLocation.fullPath
  }
}
function navigate() {
  play.previewLocation.fullPath = inputUrl.value
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) activeElement.blur()
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="border-base bg-faded grid grid-cols-[80px_1fr_80px] border border-dashed px-4 py-2"
    >
      <div class="flex items-center gap-2">
        <Icon name="i-ph-globe-duotone" />
        <span class="text-sm">Preview</span>
      </div>
      <div
        class="bg-faded border-base mx-auto flex w-full max-w-full items-center justify-center rounded border py-1 text-sm transition hover:border-gray-500"
        :class="{
          'pointer-events-none': !play.previewUrl,
        }"
      >
        <form class="w-full" @submit.prevent="navigate">
          <input
            v-model="inputUrl"
            class="w-full flex-1 bg-transparent px-2 focus:outline-none"
            type="text"
          />
        </form>
        <button
          v-if="play.previewUrl"
          class="p-1 opacity-75 hover:opacity-100"
          @click="refreshIframe"
        >
          <Icon class="flex text-sm" name="i-ph-arrow-clockwise-duotone" />
        </button>
      </div>
    </div>
    <div class="relative flex-grow">
      <PanelPreviewLoading />
      <PanelPreviewClient ref="inner" />
    </div>
  </div>
</template>
