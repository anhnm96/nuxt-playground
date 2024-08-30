// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '~/modules/template-loader',
  ],
  app: {
    head: {
      titleTemplate: '%s - Nuxt Playground',
    },
  },
  colorMode: {
    classSuffix: '',
  },
  typescript: {
    includeWorkspace: true,
  },
  googleFonts: {
    families: {
      'DM Sans': [300, 700],
      'DM Mono': [400],
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      buildTime: Date.now(),
    },
  },
  vite: {
    server: {
      // setup monaco
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    optimizeDeps: {
      include: [
        'monaco-editor/esm/vs/editor/editor.worker',
        'monaco-editor-core/esm/vs/editor/editor.worker',
        'typescript/lib/tsserverlibrary',
        '@vue/language-service',
        '@volar/monaco/worker',
        'typescript',
        'vscode-uri',
      ],
    },
  },
})
