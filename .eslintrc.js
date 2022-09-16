// eslint-disable-next-line no-undef
module.exports = {
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/html-indent': ['error', 2],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
  },
}
