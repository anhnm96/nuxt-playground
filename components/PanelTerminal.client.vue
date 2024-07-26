<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

const props = defineProps<{
  stream?: ReadableStream
}>()
const root = ref<HTMLDivElement>()
const terminal = new Terminal()
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
watch(
  () => props.stream,
  (s) => {
    if (!s) return
    const reader = s.getReader()
    function read() {
      reader.read().then(({ done, value }) => {
        terminal.write(value)
        if (!done) read()
      })
    }
    read()
  },
  { flush: 'sync', immediate: true },
)

useResizeObserver(
  root,
  useDebounceFn(() => fitAddon.fit(), 200),
)

const stop = watch(
  () => root.value,
  (el) => {
    if (!el) return
    terminal.open(el)
    terminal.write('\n')
    fitAddon.fit()
    stop()
  },
)
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-terminal-window-duotone" />
      <span class="text-sm">Terminal</span>
    </div>
    <div ref="root" style="height: calc(100% - 37px)" />
  </div>
</template>
