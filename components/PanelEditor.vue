<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'
import { filesToVirtualFsTree } from '~/templates/utils'
// TODO: replace with Monaco with a real file tree.
const props = withDefaults(
  defineProps<{
    files: VirtualFile[]
  }>(),
  {
    files: () => [],
  },
)

const files = computed(() =>
  props.files.filter((file) => !isFileIgnored(file.filepath)),
)
const directory = computed(() => filesToVirtualFsTree(files.value))
const selectedFile = ref<VirtualFile>()

// Select the first file by default.
watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0])
})

const input = ref<string>('')
function selectFile(file: VirtualFile) {
  selectedFile.value = file
}

watch(selectedFile, (file) => {
  input.value = file!.read()
})

function onTextInput() {
  // TODO: add throttle
  if (input.value != null) selectedFile?.value?.write(input.value)
}
</script>

<template>
  <div class="grid h-full grid-rows-[min-content_1fr]">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-text-t-duotone" />
      <span class="text-sm">Editor</span>
    </div>
    <div class="grid grid-cols-[1fr_2fr]">
      <div class="flex h-full flex-col">
        <PanelEditorFileSystemTree
          v-model="selectedFile"
          :directory="directory"
          :depth="-1"
        />
      </div>
      <PanelEditorMonaco
        v-if="selectedFile"
        v-model="input"
        :filepath="selectedFile.filepath"
        class="h-full w-full"
        @change="onTextInput"
      />
    </div>
  </div>
</template>
