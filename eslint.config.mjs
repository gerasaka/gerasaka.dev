// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
  },
});
