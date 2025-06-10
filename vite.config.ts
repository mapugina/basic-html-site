import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';
import type { UserConfigExport } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020',
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: 'assets',
    copyPublicDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: 'src',
  publicDir: '../src/assets',
  test: {
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.{js,ts}'],
    globals: true,
    root: 'src',
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/test/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'vite.config.ts',
        'eslint.config.ts'
      ]
    },
    environmentOptions: {
      happyDOM: {
        customElements: true,
        settings: {
          enableCustomElements: true
        }
      }
    }
  }
} as UserConfigExport);