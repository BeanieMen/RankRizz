// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-floating-promises': 'error'
  },
})
