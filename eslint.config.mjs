import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'prettier', 'next/core-web-vitals'],
    ignorePatterns:["node_modules", "build", "dist", ".next"],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-extra-semi': 'error'
    },
  }),
]

export default eslintConfig