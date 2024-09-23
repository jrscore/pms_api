import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',


	use: {
		trace: 'on-first-retry',
		headless: false, 					// UI를 보고 싶다면 false로 설정
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
	},


	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	
})
