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
