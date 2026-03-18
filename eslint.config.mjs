// .eslintrc.cjs at project root
module.exports = {
  root: true,
  env: {
    node: true, // backend / NestJS
    browser: true, // frontend / Vue
    es2021: true,
  },
  parser: '@typescript-eslint/parser', // TypeScript support
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:vue/vue3-recommended', // Vue 3 rules
    'plugin:prettier/recommended', // Prettier integration
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'vue/multi-word-component-names': 'off', // optional for Vue
    'prettier/prettier': ['error'],
  },
};
