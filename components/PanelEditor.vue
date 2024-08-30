<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
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

const ui = useUiState()

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

const onTextInput = useDebounceFn(_onTextInput, 500)
function _onTextInput() {
  if (input.value != null) selectedFile?.value?.write(input.value)
}

function startDragging() {
  ui.isPanelDragging = true
}
function endDragging(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelFileTree = e[0].size
}
// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitFileTree = computed(
  () =>
    isMounted.value || {
      width: `${ui.panelFileTree}%`,
    },
)
const panelInitEditor = computed(
  () =>
    isMounted.value || {
      width: `${100 - ui.panelFileTree}%`,
    },
)
</script>

<template>
  <div class="grid h-full grid-rows-[min-content_1fr]">
    <div
      class="border-base bg-faded flex items-center gap-2 border-b border-dashed px-4 py-2"
    >
      <Icon name="i-ph-text-t-duotone" />
      <span class="text-sm">Editor</span>
    </div>
    <Splitpanes @resize="startDragging" @resized="endDragging">
      <Pane
        class="flex h-full flex-col overflow-auto"
        :size="ui.panelFileTree"
        :style="panelInitFileTree"
      >
        <PanelEditorFileSystemTree
          v-model="selectedFile"
          :directory="directory"
          :depth="-1"
        />
      </Pane>
      <div class="splitpanes__splitter" />
      <Pane :size="100 - ui.panelFileTree" :style="panelInitEditor">
        <PanelEditorMonaco
          v-if="selectedFile"
          v-model="input"
          :filepath="selectedFile.filepath"
          class="h-full w-full"
          @change="onTextInput"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
