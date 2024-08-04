import type { Ref, UnwrapNestedRefs } from 'vue'
import type { WebContainer } from '@webcontainer/api'
import type { VirtualFile } from '../structures/VirtualFile'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'ready',
] as const

export type PlaygroundStatus = (typeof PlaygroundStatusOrder)[number] | 'error'

export interface PlaygroundState {
  files: VirtualFile[]
  status: PlaygroundStatus
  error: { message: string } | undefined
  stream: ReadableStream | undefined
  webcontainer: WebContainer | undefined
  previewUrl: ComputedRef<string>
  previewLocation: Ref<{
    origin: string
    fullPath: string
  }>
  actions: PlaygroundActions
}

export interface PlaygroundActions {
  restartServer: () => Promise<void>
}

export type UnwrapPlaygroundState = UnwrapNestedRefs<PlaygroundState>

export const usePlaygroundStore = defineStore(
  'playground',
  (): PlaygroundState => {
    const previewLocation = ref({
      origin: '',
      fullPath: '',
    })
    const previewUrl = computed(
      () => previewLocation.value.origin + previewLocation.value.fullPath,
    )

    const actions: PlaygroundActions = {
      async restartServer() {},
    }

    return {
      status: 'init',
      error: undefined,
      stream: undefined,
      files: [],
      webcontainer: undefined,
      previewUrl,
      previewLocation,
      actions,
    }
  },
)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
