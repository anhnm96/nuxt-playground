# Nuxt 3 Playground - Folow along with antfu's stream

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Notes

### Color mode setup

### Concurent boot

```typescript
let _webcontainerPromise: Promise<WebContainer>

export async function useWebContainer() {
  if (!_webcontainerPromise) _webcontainerPromise = WebContainer.boot()
  return await _webcontainerPromise
}
```

### Loading async template

```typescript
// basic.ts
export default function load() {
  // ...
  return { files, tree }
}
// index.ts
export const templates = {
  basic: () => import('./basic').then((m) => m.default()),
}
// usage
const { files, tree } = await templates.basic()
```

### Typing untyped component

```typescript
declare module 'splitpanes' {
  import type { Component } from 'vue'

  export interface SplitpaneProps {
    horizontal: boolean
    pushOtherPanes: boolean
    dblClickSplitter: boolean
    firstSplitter: boolean
  }

  export interface PaneProps {
    size: number | string
    minSize: number | string
    maxSize: number | string
  }

  export type Pane = Component<PaneProps>
  export const Pane: Pane
  export const Splitpanes: Component<SplitpaneProps>
}
```

### File tree component

- components\PanelEditorFileSystemTree.vue
- components\FileIcon.vue

### `birpc` for communication between iframe and parent

- components\PanelPreviewClient.client.vue
- templates\basic\.layer-playground\plugins\playground.client.ts

### Custom bundler for template

- modules\template-loader.ts
- templates\basic.ts
- types\shim.d.ts
