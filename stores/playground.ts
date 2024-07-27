import type { Ref, UnwrapNestedRefs } from 'vue'
import type { WebContainer } from '@webcontainer/api'
import type { VirtualFile } from '../structures/VirtualFile'

export type PlaygroundStatus =
  | 'init'
  | 'mount'
  | 'install'
  | 'start'
  | 'ready'
  | 'error'

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

    return {
      status: 'init',
      error: undefined,
      stream: undefined,
      files: [],
      webcontainer: undefined,
      previewUrl,
      previewLocation,
    }
  },
)
