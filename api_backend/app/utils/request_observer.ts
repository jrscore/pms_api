import { Page } from "playwright"

export async function useRequestObserver(page:Page, param:string): Promise<void> {
		await page.route(param, async (route) => {
			const request = route.request()
			console.log('APIURL:', request.url())
			console.log('API헤더:', request.headers())
			console.log('API바디:', request.postData())
			await route.continue()
		})
	}
