import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  use: {
    baseURL: 'http://localhost:3001',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url:     'http://localhost:3001',
    reuseExistingServer: !process.env.CI
  }
});
