module.exports = {
    extends: ['plugin:vue/vue3-recommended'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    // env: {
    //     es2021: true,
    // },
    rules: {
        'vue/html-indent': ['error', 4],
        'spaced-comment': [
            'error',
            'always',
            {
                markers: ['/'],
            },
        ],
    },
}
