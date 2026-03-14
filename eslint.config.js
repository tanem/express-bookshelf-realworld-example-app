'use strict';

const js = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      jest,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {caughtErrorsIgnorePattern: '^_', argsIgnorePattern: '^_'},
      ],
    },
  },
  {
    files: ['**/__tests__/**'],
    languageOptions: {
      globals: {
        any: 'readonly',
      },
    },
  },
  {
    ignores: ['_coverage/'],
  },
];
