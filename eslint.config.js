import antfu from '@antfu/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    rules: {
      'style/key-spacing': 'off',
      'style/object-curly-spacing': 'off',
      'antfu/if-newline': 'off',
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'style/brace-style': ['error', '1tbs'],
    },
  },
  nuxt,
  eslintPluginPrettierRecommended,
  {
    ignores: ['**/*.md'],
  },
)
