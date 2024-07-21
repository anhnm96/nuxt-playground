<script setup lang="ts">
const iframe = ref<HTMLIFrameElement>()
const wcUrl = ref<string>()
type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = ref<Status>('init')
const error = shallowRef<{ message: string }>()
const stream = ref<ReadableStream>()
async function startDevServer() {
  const tree = globFilesToWebContainerFs(
    '../templates/basic/',
    import.meta.glob(['../templates/basic/*.*', '!**/node_modules/**'], {
      query: '?raw',
      import: 'default',
      eager: true,
    }),
  )
  const wc = await useWebContainer()
  wc.on('server-ready', (port, url) => {
    status.value = 'ready'
    wcUrl.value = url
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
  const devProcess = await wc.spawn('pnpm', ['run', 'dev'])
  stream.value = devProcess.output

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devProcess.kill()
    })
  }
}
watchEffect(() => {
  if (iframe.value && wcUrl.value) iframe.value.src = wcUrl.value
})
onMounted(startDevServer)
</script>

<template>
  <div class="flex h-full flex-col pb-16">
    <div class="flex flex-auto items-center">
      <iframe v-show="status === 'ready'" ref="iframe" class="h-full w-full" />
      <div
        v-if="status !== 'ready'"
        class="mx-auto flex flex-col items-center justify-center text-lg capitalize"
      >
        <Icon name="i-svg-spinners-90-ring-with-bg" />
        {{ status }}ing...
      </div>
    </div>
    <TerminalOutput :stream="stream" />
  </div>
</template>
