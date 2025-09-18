// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'public/**',
      '**/*.min.js',
      '**/*.min.css',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'import/no-duplicates': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features/**/model/**',
                '@/features/**/lib/**',
                '@/entities/**/model/**',
                '@/entities/**/lib/**',
              ],
              message: 'Импортируй через публичный API (index.ts) своего пакета.',
            },
          ],
        },
      ],
    }
  },

  prettierConfig,
];
