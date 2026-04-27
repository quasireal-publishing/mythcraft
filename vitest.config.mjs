import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup/foundry-mock.mjs'],
    include: ['test/**/*.test.mjs'],
    globals: true,
  },
});
