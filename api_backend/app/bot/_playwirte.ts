// import { Browser, Page } from 'playwright'
// import { Monit, Inverter } from '../model/model'
// import { MonitBot } from './factory'

// export class Octo implements MonitBot {
// 	private brws: Browser
// 	private httpService: HttpService
// 	private ukey: string | null = null

// 	private apiUrl = 'https://emsapi.atlasconn.com:12443/api/v1/inverter/data'
// 	private url = 'http://cmsolar.kr/login.php'
// 	private idtag = '#user-id'
// 	private pwtag = '#user-password'
// 	private loginBtn = 'button.Basic-Button.Red'
// 	private logoutTag = 'xxxxx'

// 	private id = '무안전기'
// 	private pass = '7101'
// 	private list = []

// 	constructor(brws: Browser) {
// 		this.brws = brws
// 		this.httpService = new HttpService(this.apiUrl)
// 	}

// 	async getMonit(): Promise<Monit[]> {
// 		console.log('getData')

// 		const page = await this.brws.newPage()

// 		// 이미지 비활성화
// 		await page.route('**/*', (route) =>
// 			route.request().resourceType() === 'image' ? route.abort() : route.continue()
// 		)

// 		try {
// 			await this.login(page)
// 			const plants = await this.getAllPlantData(page, [9082, 7756]) // 여러 mcno 값
// 			await this.logout(page)
// 			await page.close()

// 			return plants
// 		} catch (error) {
// 			console.error('Error fetching data:', error)
// 			await page.close()
// 			throw error
// 		}
// 	}

// 	async login(page: Page) {
// 		try {
// 			await page.goto(this.url)
// 			await page.locator(this.idtag).fill(this.id) // id
// 			await page.locator(this.pwtag).fill(this.pass) // pass
// 			await page.locator(this.loginBtn).click() // 로그인

// 			this.ukey = await page.evaluate(() => {
// 				const session = localStorage.getItem('user')
// 				return session ? JSON.parse(session).userKey : null
// 			})

// 			if (this.ukey) {
// 				this.httpService.setCookies(`userKey=${this.ukey}`)
// 				console.log('로그인 성공')
// 			} else {
// 				throw new Error('userKey를 로컬 스토리지에서 찾을 수 없습니다.')
// 			}
// 		} catch (error) {
// 			console.error('로그인 실패:', error)
// 			throw error
// 		}
// 	}

// 	async getAllPlantData(page: Page, mcnoList: number[]): Promise<Monit[]> {
// 		const plants: Monit[] = []
// 		for (const mcno of mcnoList) {
// 			const plant = await this.getPlantData(page, mcno)
// 			plants.push(plant)
// 		}
// 		return plants
// 	}

// 	async getPlantData(page: Page, mcno: number): Promise<Monit> {
// 		console.log('인버터')

// 		const currentMinutes = new Date().getMinutes()
// 		const time = currentMinutes * 100000

// 		const response = await this.httpService.get(`${this.apiUrl}?mcno=${mcno}&uKey=${this.ukey}&time=${time}`)
// 		const json = response

// 		// 인버터 추출
// 		const invs = json.inverters.map((inv: any) => ({
// 			pwr: inv.ackw,
// 			day: inv.dayTotal,
// 			yld: inv.total,
// 			run: inv.isRun,
// 			flt: false
// 		}))

// 		// 인버터에서 pwr, day의 합계 계산
// 		const power = invs.reduce((sum, inv) => sum + inv.pwr, 0)
// 		const dayyld = invs.reduce((sum, inv) => sum + inv.day, 0)

// 		return {
// 			alias: 'Alias',
// 			pwr: power,
// 			day: dayyld,
// 			invs: invs
// 		}
// 	}

// 	async logout(page: Page) {
// 		await page.click(this.logoutTag)
// 	}
// }
