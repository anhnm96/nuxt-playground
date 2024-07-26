<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

const iframe = ref<HTMLIFrameElement>()
type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()
const isDragging = usePanelDragging()
const panelSizeEditor = usePanelCookie('nuxt-playground-panel-editor', 30)
const panelSizeFrame = usePanelCookie('nuxt-playground-panel-frame', 30)

const { iframeLocation, wcUrl } = usePlayground()
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(
  computed(() => iframeLocation.value.fullPath),
  inputUrl,
  { direction: 'ltr' },
)

const stream = ref<ReadableStream>()
async function startDevServer() {
  const tree = globFilesToWebContainerFs(
    '../templates/basic/',
    import.meta.glob(
      ['../templates/basic/**/*.*', '../templates/basic/**/.npmrc'],
      {
        query: '?raw',
        import: 'default',
        eager: true,
      },
    ),
  )
  const wc = await useWebContainer()
  wc.on('server-ready', (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      status.value = 'ready'
      iframeLocation.value = {
        origin: url,
        fullPath: '/',
      }
    }
  })
  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })
  status.value = 'mount'
  console.log({ tree })
  await wc.mount(tree)
  status.value = 'install'
  const installProcess = await wc.spawn('pnpm', ['install'])
  stream.value = installProcess.output
  const installExitCode = await installProcess.exit
  if (installExitCode !== 0) {
    status.value = 'error'
    error.value = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    throw new Error('Unable to run npm install')
  }
  status.value = 'start'
  const devProcess = await wc.spawn('pnpm', ['dev'])
  stream.value = devProcess.output

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devProcess.kill()
    })
  }
}

function startDragging() {
  isDragging.value = true
}
function endDragging(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0].size
  panelSizeFrame.value = e[1].size
}

function refreshIframe() {
  if (wcUrl.value && iframe.value) {
    iframe.value.src = wcUrl.value
    inputUrl.value = iframeLocation.value.fullPath
  }
}
function navigate() {
  iframeLocation.value.fullPath = inputUrl.value
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) activeElement.blur()
}

onMounted(startDevServer)
</script>

<template>
  <Splitpanes
    horizontal
    class="flex h-full flex-col"
    @resize="startDragging"
    @resized="endDragging"
  >
    <Pane :size="panelSizeEditor" min-size="10">
      <PanelEditor />
    </Pane>
    <Pane class="flex flex-col">
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
            'pointer-events-none': !wcUrl,
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
            v-if="wcUrl"
            class="p-1 opacity-75 hover:opacity-100"
            @click="refreshIframe"
          >
            <Icon class="flex text-sm" name="i-ph-arrow-clockwise-duotone" />
          </button>
        </div>
      </div>
      <div class="relative flex-grow">
        <iframe
          v-if="wcUrl"
          ref="iframe"
          class="h-full w-full"
          :class="{ 'pointer-events-none': isDragging }"
          :src="wcUrl"
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
    </Pane>
    <Pane>
      <PanelTerminal :stream="stream" />
    </Pane>
  </Splitpanes>
</template>
