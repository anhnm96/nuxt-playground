<script setup lang="ts">
const ui = useUiState()
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-terminal-window-duotone" />
      <span class="text-sm">Terminal</span>
      <button
        class="hover:bg-active ml-auto flex rounded p-1"
        @click="ui.toggleTerminal()"
      >
        <Icon name="i-ph-x-bold" />
      </button>
    </div>
    <PanelTerminalClient />
  </div>
</template>
