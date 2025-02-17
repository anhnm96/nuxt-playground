<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import type { ITheme } from '@xterm/xterm'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import themeLight from 'theme-vitesse/extra/xterm-vitesse-light.json'
import themeDark from 'theme-vitesse/extra/xterm-vitesse-dark.json'

const play = usePlaygroundStore()

const colorMode = useColorMode()
const theme = computed<ITheme>(() => {
  return colorMode.value === 'dark'
    ? {
        ...themeDark,
        background: '#00000000',
      }
    : {
        ...themeLight,
        background: '#00000000',
      }
})

const root = ref<HTMLDivElement>()
const terminal = new Terminal({
  customGlyphs: true,
  allowTransparency: true,
  theme: theme.value,
  fontFamily: 'DM Mono, monospace',
})

watch(
  () => theme.value,
  (t) => {
    terminal.options.theme = t
  },
)

const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
let init = false
watch(
  () => play.currentProcess,
  (p) => {
    if (!p) return
    try {
      const reader = p.output.getReader()
      function read() {
        reader.read().then(({ done, value }) => {
          if (value) terminal.write(value)
          if (!done) read()
        })
      }
      if (!init) {
        init = true
      } else {
        terminal.writeln('')
        terminal.writeln(`-------------`)
        terminal.writeln('')
      }
      read()
    } catch (e) {
      console.error(e)
    }

    try {
      const writer = p.input.getWriter()
      terminal.onData((data) => {
        try {
          writer.write(data)
        } catch (e) {
          console.error(e)
        }
      })
    } catch (e) {
      console.error(e)
    }
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
  <div ref="root" style="height: calc(100% - 41px)" />
</template>
