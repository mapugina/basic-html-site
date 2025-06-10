import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import type { Linter } from '@typescript-eslint/utils/ts-eslint';
import importPlugin from 'eslint-plugin-import';

const config: Linter.FlatConfig[] = [
  {
    // Ignore generated files and dependencies
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**']
  },
  eslint.configs.recommended,
  {
    // Base configuration for all files
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest' as const,
      sourceType: 'module' as const,
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        customElements: 'readonly',
        HTMLElement: 'readonly',
        CustomEvent: 'readonly',
        fetch: 'readonly',
        MutationObserver: 'readonly',
        // Test globals
        setTimeout: 'readonly',
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }]
    }
  },
  {
    // Configuration for src files
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  {
    // Configuration for Node.js files
    files: ['vite.config.ts', 'eslint.config.ts'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        process: 'readonly'
      }
    }
  }
];

export default config;