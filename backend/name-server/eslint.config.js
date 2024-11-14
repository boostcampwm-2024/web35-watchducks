import typeScriptEsLintPlugin from '@typescript-eslint/eslint-plugin';
import esLintConfigPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

// Translate ESLintRC-style configs into flat configs.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typeScriptEsLintPlugin.configs['recommended'],
});

export default [
  // Flat config for parsing TypeScript files. Includes rules for TypeScript.
  ...compat.config({
    env: { node: true },
    extends: ['plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // '@typescript-eslint/consistent-type-exports': [
      //   'error',
      //   { fixMixedExportsWithInlineTypeSpecifier: true },
      // ],
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  }),

  // Flat config for turning off all rules that are unnecessary or might conflict with Prettier.
  esLintConfigPrettier,

  // Flat config for ESLint rules.
  {
    rules: {
      camelcase: ['error', { ignoreDestructuring: true }],
    },
  },
];
