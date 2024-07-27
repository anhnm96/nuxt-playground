import { WebContainer } from '@webcontainer/api'
import type { PlaygroundState } from '../stores/playground'
import { loadTemplate } from '~/templates/basic'

if (import.meta.server)
  throw new Error('WebContainer cannot be mounted on server')

let _webcontainerPromise: Promise<WebContainer>

export async function useWebContainer() {
  if (!_webcontainerPromise) _webcontainerPromise = WebContainer.boot()
  return await _webcontainerPromise
}

export async function mountPlayground(play: PlaygroundState) {
  const { files, tree } = loadTemplate()

  window.addEventListener('message', (event) => {
    if (event.origin !== play.previewLocation.origin) return

    switch (event.data.type) {
      case 'update:path':
        play.previewLocation.fullPath = event.data.path
        break
      default:
        break
    }
  })

  const wc = await useWebContainer()

  play.files = files
  files.forEach((file) => {
    file.wc = wc
  })

  wc.on('server-ready', (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      play.status = 'ready'
      play.previewLocation = {
        origin: url,
        fullPath: '/',
      }
    }
  })

  wc.on('error', (err) => {
    play.status = 'error'
    play.error = err
  })

  play.status = 'mount'
  await wc.mount(tree)

  play.status = 'install'

  const installProcess = await wc.spawn('pnpm', ['install'])
  play.stream = installProcess.output
  const installExitCode = await installProcess.exit

  if (installExitCode !== 0) {
    play.status = 'error'
    play.error = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    throw new Error('Unable to run npm install')
  }

  play.status = 'start'
  const devProcess = await wc.spawn('pnpm', ['dev'])
  play.stream = devProcess.output

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devProcess.kill()
    })
  }
}
