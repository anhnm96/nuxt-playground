<script setup lang="ts">
const isDragging = usePanelDragging()
const playground = useGlobalPlayground()
playground.value = createPlayground()
const { mount, previewLocation, previewUrl, status } = playground.value

const iframe = ref<HTMLIFrameElement>()
const inputUrl = ref<string>('')
// auto update inputUrl when location value changed
syncRef(
  computed(() => previewLocation.value.fullPath),
  inputUrl,
  { direction: 'ltr' },
)
function refreshIframe() {
  if (previewUrl.value && iframe.value) {
    iframe.value.src = previewUrl.value
    inputUrl.value = previewLocation.value.fullPath
  }
}
function navigate() {
  previewLocation.value.fullPath = inputUrl.value
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) activeElement.blur()
}
onMounted(() => {
  mount()
})
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
          'pointer-events-none': !previewUrl,
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
          v-if="previewUrl"
          class="p-1 opacity-75 hover:opacity-100"
          @click="refreshIframe"
        >
          <Icon class="flex text-sm" name="i-ph-arrow-clockwise-duotone" />
        </button>
      </div>
    </div>
    <div class="relative flex-grow">
      <iframe
        v-if="previewUrl"
        ref="iframe"
        class="h-full w-full"
        :class="{ 'pointer-events-none': isDragging }"
        :src="previewUrl"
        allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
      />
      <div
        v-if="status !== 'ready'"
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-lg capitalize"
      >
        <Icon name="ph:spinner-ball" class="animate-spin text-primary" />
        {{ status }}ing...
      </div>
    </div>
  </div>
</template>
