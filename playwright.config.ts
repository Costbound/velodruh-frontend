import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://18.207.122.202";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        video: {
          mode: "on",
          size: { width: 1280, height: 720 },
        },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        video: {
          mode: "on",
          size: { width: 412, height: 915 },
        },
      },
    },
  ],
});
