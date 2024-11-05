import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/prefer-query-object-syntax': 'error',
      '@tanstack/query/stable-query-client': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/*',
              group: 'internal',
              position: 'after'
            }
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: pluginImport,
      react: pluginReact
    },
    settings: {
      react: {
        version: '18.3.1'
      }
    }
  }
];
