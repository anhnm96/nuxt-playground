<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import ButtonShowSolution from './content/ButtonShowSolution.vue'
import { filesToVirtualFsTree } from '~/templates/utils'

const play = usePlaygroundStore()
const ui = useUiState()

const files = computed(() =>
  Array.from(play.files.values()).filter(
    (file) => !isFileIgnored(file.filepath),
  ),
)
const directory = computed(() => filesToVirtualFsTree(files.value))

const input = ref<string>('')

watch(
  () => play.fileSelected,
  () => {
    input.value = play.fileSelected?.read() || ''
  },
)

watch(
  () => [play.mountedGuide, play.showingSolution],
  () => {
    input.value = play.fileSelected?.read() || ''
  },
)

const onTextInput = useDebounceFn(_onTextInput, 500)
function _onTextInput() {
  if (input.value != null) play?.fileSelected?.write(input.value)
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
// eslint-disable-next-line prettier/prettier
const panelInitFileTree = computed(() => isMounted.value || {
  width: `${ui.panelFileTree}%`,
},
)
// eslint-disable-next-line prettier/prettier
const panelInitEditor = computed(() => isMounted.value || {
  width: `${100 - ui.panelFileTree}%`,
},
)
</script>

<template>
  <div class="grid h-full grid-rows-[min-content_1fr]">
    <div
      class="border-base bg-faded flex justify-between border-b border-dashed px-4 py-2"
    >
      <div class="flex items-center gap-2">
        <Icon name="i-ph-text-t-duotone" />
        <span class="text-sm">Editor</span>
      </div>
      <ButtonShowSolution
        class="hover:bg-active -my-1 -mr-3 flex-none rounded px-2 py-1 text-sm opacity-50 hover:opacity-100"
      />
    </div>
    <Splitpanes
      class="overflow-hidden"
      @resize="startDragging"
      @resized="endDragging"
    >
      <Pane
        class="flex h-full flex-col overflow-auto"
        :size="ui.panelFileTree"
        :style="panelInitFileTree"
      >
        <PanelEditorFileSystemTree
          v-model="play.fileSelected"
          :directory="directory"
          :depth="-1"
        />
      </Pane>
      <div class="splitpanes__splitter" />
      <Pane :size="100 - ui.panelFileTree" :style="panelInitEditor">
        <LazyPanelEditorMonaco
          v-if="play.fileSelected"
          v-model="input"
          :filepath="play.fileSelected.filepath"
          class="h-full w-full"
          @change="onTextInput"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
