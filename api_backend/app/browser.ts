import { chromium, Browser, Page, BrowserContext } from 'playwright'

export class BrowserInstance {

	private static inst: Browser | null = null


	private static async init(): Promise<void> {
		if (this.inst === null) {
			this.inst = await chromium.launch({ 
				headless: false, 
				args: ['--no-sandbox', '--disable-setuid-sandbox'] 
			})
		}
	}


	private static async newContext(): Promise<BrowserContext> {
    if (this.inst === null) 	await this.init()
    return this.inst!.newContext()
  }


	public static async getPage(): Promise<Page> {
		const context = await this.newContext()
		const page = await context.newPage()

		await page.route('**/*', (route) => {
			const resourceType = route.request().resourceType();
			['image', 'font'].includes(resourceType) 
				? route.abort() 
				: route.continue();
		})
		return page
	}

	public static async close(): Promise<void> {
		if (this.inst !== null) {
			await this.inst.close()
			this.inst = null
		}
	}
}
