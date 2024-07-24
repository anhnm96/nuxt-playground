<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()
type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()
const isDragging = usePanelDragging()
const panelSizeEditor = usePanelCookie('nuxt-playground-panel-editor', 30)
const panelSizeFrame = usePanelCookie('nuxt-playground-panel-frame', 30)

const stream = ref<ReadableStream>()
async function startDevServer() {
  const tree = globFilesToWebContainerFs(
    '../templates/basic/',
    import.meta.glob(
      ['../templates/basic/*.*', '../templates/basic/**/.npmrc'],
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
      wcUrl.value = url
    }
  })
  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })
  status.value = 'mount'
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
        class="border-base bg-faded flex items-center gap-2 border border-dashed px-4 py-2"
      >
        <Icon name="i-ph-globe-duotone" />
        <span class="text-sm">Preview</span>
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
          <Icon name="i-svg-spinners-90-ring-with-bg" />
          {{ status }}ing...
        </div>
      </div>
    </Pane>
    <Pane>
      <PanelTerminal :stream="stream" />
    </Pane>
  </Splitpanes>
</template>
