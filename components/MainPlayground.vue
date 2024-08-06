<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import type { VirtualFile } from '~/structures/VirtualFile'

const ui = useUiState()
const play = usePlaygroundStore()

function startDragging() {
  ui.isPanelDragging = true
}
function endDraggingVertical(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelDocs = e[0].size
}
function endDraggingHorizontal(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelEditor = e[0].size
  ui.panelPreview = e[1].size
}

const terminalPaneProps = computed(() => {
  if (ui.showTerminal) {
    return {
      size: 100 - ui.panelEditor - ui.panelPreview,
    }
  } else {
    return {
      size: 0,
      maxSize: 0,
    }
  }
})

// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitDocs = computed(
  () =>
    isMounted.value || {
      width: `${ui.panelDocs}%`,
    },
)
const panelInitRight = computed(
  () =>
    isMounted.value || {
      width: `${100 - ui.panelDocs}%`,
    },
)
const panelInitEditor = computed(
  () =>
    isMounted.value || {
      height: `${ui.panelEditor}%`,
    },
)
const panelInitPreview = computed(
  () =>
    isMounted.value || {
      height: `${ui.panelPreview}%`,
    },
)
const panelInitTerminal = computed(
  () =>
    isMounted.value || {
      height: `${100 - ui.panelEditor - ui.panelPreview}%`,
    },
)
</script>

<template>
  <Splitpanes
    class="flex min-h-0"
    @resize="startDragging"
    @resized="endDraggingVertical"
  >
    <Pane :size="ui.panelDocs" min-size="10" :style="panelInitDocs">
      <PanelDocs />
    </Pane>
    <div class="splitpanes__splitter" />
    <Pane :size="100 - ui.panelDocs" :style="panelInitRight">
      <Splitpanes
        horizontal
        class="flex h-full flex-col"
        @resize="startDragging"
        @resized="endDraggingHorizontal"
      >
        <Pane
          :size="ui.panelEditor"
          min-size="10"
          :style="panelInitEditor"
          class="min-h-0"
        >
          <PanelEditor :files="play.files" />
        </Pane>
        <div class="splitpanes__splitter" />
        <Pane :size="ui.panelPreview" min-size="10" :style="panelInitPreview">
          <PanelPreview />
        </Pane>
        <div class="splitpanes__splitter" />
        <Pane
          v-bind="terminalPaneProps"
          :style="panelInitTerminal"
          :class="ui.showTerminal ? '' : 'pane-hidden'"
        >
          <PanelTerminal />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
