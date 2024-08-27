<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'
import type { VirtualFileSystemTree } from '~/structures/VirtualFileSystemTree'

const props = defineProps<{
  name?: string
  directory?: VirtualFileSystemTree
  file?: VirtualFile
  depth: number
}>()
const selectedFile = defineModel<VirtualFile>()
const isFileSelected = computed(
  () => props.file?.filepath === selectedFile.value?.filepath,
)
// TODO: config default open from templates
const isDirectoryOpen = ref(true)
function handleClick() {
  if (props.directory) isDirectoryOpen.value = !isDirectoryOpen.value
  else if (props.file) selectedFile.value = props.file
}
// put folders first and sort alphabetically
const sortedDirectory = computed(
  () =>
    props.directory &&
    Object.fromEntries(
      Object.entries(props.directory).sort(([aName, a], [bName, b]) => {
        if ('directory' in a && !('directory' in b)) return -1
        if (!('directory' in a) && 'directory' in b) return 1
        return aName.localeCompare(bName)
      }),
    ),
)
</script>

<template>
  <div>
    <button
      v-if="name"
      class="hover:bg-active flex w-full items-center gap-1 px-2 py-1 text-left text-sm"
      :style="{
        paddingLeft: `${0.2 + 0.8 * props.depth}rem`,
      }"
      :class="isFileSelected ? 'bg-active' : 'text-faded'"
      @click="handleClick"
    >
      <Icon
        v-if="directory"
        :class="isDirectoryOpen && 'rotate-90'"
        class="h-4 w-4 opacity-50 transition-transform duration-300"
        name="ph:caret-right"
      />
      <div v-else class="h-4 w-4"></div>
      <FileIcon
        class="h-4 w-4"
        :path="name"
        :is-directory="!!props.directory"
        :is-directory-open="isDirectoryOpen"
      />
      <span class="ml-1">{{ name }}</span>
    </button>
    <div v-if="directory" v-show="isDirectoryOpen">
      <PanelEditorFileSystemTree
        v-for="(child, chileName) in sortedDirectory"
        :key="chileName"
        v-model="selectedFile"
        :name="chileName.toString()"
        v-bind="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>
