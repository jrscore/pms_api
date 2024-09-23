
import { chromium } from 'playwright'

const url = 'https://www.semsportal.com/home/login'
const apiUrl = 'https://hk.semsportal.com/api/PowerStationMonitor/QueryPowerStationMonitor'
const payload = {
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

const id = 'muan446600@naver.com'
const pwd = 'gw123456'

const el_id = '#username'
const el_pwd = '#password'
const el_chk = '#readStatement'
const el_login = '#btnLogin'

;(async () => {
  const browser = await chromium.launch({ headless: false }) // headless: true for headless mode
  const context = await browser.newContext()
  const page = await context.newPage()


  await page.route('**/*.{png,jpg,jpeg,ico,woff}', route => route.abort())
  await page.goto(url)
	
  // LOGIN
  await page.locator(el_id).fill(id)
  await page.locator(el_pwd).fill(pwd)
  await page.locator(el_chk).click({ force: true })
  await page.locator(el_login).click({ force: true })
	await page.waitForURL('**/powerstatus');

	// // 로그인 후 토큰 추출
	// const token = await page.evaluate(() => {
	// 	return window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
	// })


	// 네트워크 요청을 콘솔에 기록
	page.on('request', request => {
		console.log('')
		console.log('')
		console.log('>>', request.method(), request.url())
		console.log('>> Headers:', request.headers())
		if (request.postData()) {
			console.log('>> Payload:', request.postData())
		}
	})

  // POST 요청을 수동으로 발생
	const response = await page.evaluate(async ({ apiUrl, payload }) => {
		const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    return data
	}, { apiUrl, payload })

  console.log(response)
	

	// const response = await page.evaluate(async ({ apiUrl, payload }) => {
	// 		const response = await fetch(apiUrl, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Accept': 'application/json, text/javascript, */*; q=0.01',
	// 				'Content-Type': 'application/json, text/javascript, */*; q=0.01'
	// 			},
	// 			body: JSON.stringify(payload)
	// 		})
	// 		return response.json()
	// 	}, 
	// 	{ apiUrl, payload }
	// )
	// console.log(response)



  // 종료
  // await browser.close()
})()
