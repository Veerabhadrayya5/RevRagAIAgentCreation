
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30000,

  expect: {
    timeout: 7000
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'https://www.w3schools.com',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
trace: 'retain-on-failure',
actionTimeout: 10000,
navigationTimeout: 20000,
  }
});
