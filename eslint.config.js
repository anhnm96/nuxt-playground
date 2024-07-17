import antfu from '@antfu/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    formatters: true,
    rules: {
      'style/key-spacing': 'off',
      'style/object-curly-spacing': 'off',
    },
  },
  nuxt,
  eslintPluginPrettierRecommended,
  {
    ignores: ['*.md'],
  },
)
