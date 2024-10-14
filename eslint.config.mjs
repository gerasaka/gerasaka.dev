// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['app/**/*.ts', 'app/**/*.ts'],
    rules: {
      'no-console': 'warn'
    }
  },
)
