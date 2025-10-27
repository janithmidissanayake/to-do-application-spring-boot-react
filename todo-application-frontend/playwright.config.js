// @ts-check
import { defineConfig, devices } from '@playwright/test';
import process from 'node:process'; // ✅ Add this line

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Use only Chromium if PLAYWRIGHT_FAST=true for faster tests
  projects: process.env.PLAYWRIGHT_FAST === 'true' 
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      ],
  webServer: process.env.PLAYWRIGHT_BASE_URL 
    ? undefined  // Use external server when PLAYWRIGHT_BASE_URL is set (Docker E2E)
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },
});
