<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'
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
const selectedFile = ref<VirtualFile>()

// Select the first file by default.
watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0])
})

const input = ref<string>()
function selectFile(file: VirtualFile) {
  selectedFile.value = file
  input.value = file.read()
}
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
        <button
          v-for="file in files"
          :key="file.filepath"
          class="hover:bg-active px-2 py-1 text-left"
          :class="{
            'text-primary': file.filepath === selectedFile?.filepath,
          }"
          @click="selectFile(file)"
        >
          {{ file.filepath }}
        </button>
      </div>
      <textarea
        v-model="input"
        class="border-base h-full w-full resize-none border-l bg-transparent p-4 font-mono"
        @input="onTextInput"
      />
    </div>
  </div>
</template>
