<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

const isDragging = usePanelDragging()
const leftSize = useLocalStorage('nuxt-playground-panel-left', 30)

function start() {
  isDragging.value = true
}
function end(e: { size: number }[]) {
  isDragging.value = false
  leftSize.value = e[0].size
}
</script>

<template>
  <div class="bg-base flex h-screen w-screen flex-col overflow-hidden">
    <TheNav />
    <Splitpanes class="flex h-full" @resize="start" @resized="end">
      <Pane :size="leftSize" min-size="10">
        <article class="dark:prose-invert prose">
          <ContentDoc />
        </article>
      </Pane>
      <Pane>
        <ThePlayground />
      </Pane>
    </Splitpanes>
  </div>
</template>
