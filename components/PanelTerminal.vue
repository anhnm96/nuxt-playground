<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-terminal-window-duotone" />
      <span class="text-sm">Terminal</span>
      <div class="ml-auto flex gap-2">
        <button
          class="hover:bg-active flex rounded p-1"
          title="Restart terminal"
          @click="play.actions.restartServer()"
        >
          <Icon name="i-ph-arrow-clockwise-duotone" />
        </button>
        <button
          class="hover:bg-active flex rounded p-1"
          title="Hide terminal"
          @click="ui.toggleTerminal()"
        >
          <Icon name="i-ph-x-bold" />
        </button>
      </div>
    </div>
    <PanelTerminalClient />
  </div>
</template>
