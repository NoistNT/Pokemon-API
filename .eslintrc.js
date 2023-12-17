const { resolve } = require('node:path')

const project = resolve(__dirname, 'tsconfig.json')

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  plugins: ['prettier', 'import'],
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    project
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        printWidth: 80,
        trailingComma: 'none',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'auto'
      }
    ],
    'import/no-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'type',
          'builtin',
          'object',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after'
          }
        ],
        'newlines-between': 'always'
      }
    ],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: ['return', 'export'] },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],
    'no-undef': 'off',
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'import/no-unresolved': 0
  }
}
