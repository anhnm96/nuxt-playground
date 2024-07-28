<script setup lang="ts">
// @ts-expect-error missing type
import { Pane, Splitpanes } from 'splitpanes'

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
</script>

<template>
  <Splitpanes
    class="flex h-full"
    @resize="startDragging"
    @resized="endDraggingVertical"
  >
    <Pane :size="ui.panelDocs" min-size="10">
      <PanelDocs />
    </Pane>
    <Pane :size="100 - ui.panelDocs">
      <Splitpanes
        horizontal
        class="flex h-full flex-col"
        @resize="startDragging"
        @resized="endDraggingHorizontal"
      >
        <Pane :size="ui.panelEditor" min-size="10">
          <PanelEditor :files="play?.files" />
        </Pane>
        <Pane :size="ui.panelPreview" min-size="10">
          <PanelPreview />
        </Pane>
        <Pane :size="100 - ui.panelEditor - ui.panelPreview">
          <PanelTerminal :stream="play?.stream" />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
