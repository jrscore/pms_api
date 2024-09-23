import { test, expect } from '@playwright/test'

const url 		= 'https://www.semsportal.com/home/login'
const apiUrl	= 'https://www.semsportal.com/home/login/api/PowerStationMonitor/QueryPowerStationMonitor'
const payload	= {
	adcode: "",
	condition: "",
	key: "",
	orderby: "",
	org_id: "",
	page_index: 1,
	page_size: 14,
	powerstation_id: "",
	powerstation_status: "",
	powerstation_type: ""
}

const id				= 'muan446600@naver.com'
const pwd				= 'gw123456'

const el_id			= '#username'
const el_pwd		= '#password'
const el_chk		= '#readStatement'
const el_login	= '#btnLogin'


test('goodwe', async ({ page }) => {

	await page.route('**/*.{png,jpg,jpeg}', r => r.abort())
	await page.goto(url)	

	// LOGIN
	await page.locator(el_id).fill(id)
	await page.locator(el_pwd).fill(pwd)
	await page.locator(el_chk).click({ force: true })
	await page.locator(el_login).click({ force: true })


	// POST 요청
	const response = await page.request.post(apiUrl, {
		headers: {'Content-Type': 'application/json'},
		data: JSON.stringify(payload)
	})
	

	// 응답 확인
	const json = await response.json()
	console.log(json)
	expect(response.status()).toBe(200)
})
