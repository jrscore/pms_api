import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { ISiteInfo } from '../model/monit_model'

// axios 기본 설정
const headerBasic = {
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,,application/signed-exchange;v=b3;q=0.7',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
}
const header = {
	'Host': 'www.cmsolar.kr',
	'Origin': 'http://www.cmsolar.kr',
	'Referer': 'http://www.cmsolar.kr/login.php',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
}
const api = wrapper(axios.create({
	baseURL: 'http://www.cmsolar.kr',
	withCredentials: true,
	headers: header,
	jar: new CookieJar()
	// xsrfCookieName: 'XSRF-TOKEN',			// CSRF 토큰을 저장할 쿠키 이름 xsrfHeaderName: 'X-Csrf-Token',		// CSRF 토큰을 포함할 헤더 이름
}))



export class CmBot implements Bot {
	private url: string = ''

	private sites: ISiteInfo[]

	constructor(sites:ISiteInfo[]){
		this.sites = sites
		// this.initialize()
	}

	// async initialize(infos: ISiteMonitInfo[]) {
	// 	this.infos = infos
	// 	const model = await getMonitModel('cm')
	// 	if (model) {
	// 		this.url = model.url
	// 	}
	// 	api.defaults.baseURL = this.url
	// }


	async login(): Promise<void> {
		const header = {
			'Host': 'www.cmsolar.kr',
			'Origin': 'http://www.cmsolar.kr',
			'Referer': 'http://www.cmsolar.kr/login.php',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			'Cache-Control': 'max-age=0',
			'Connection' : 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',

		}
		const payload = {
			id: 'qldnjf4',
			pw: '123456',
			commit: 'Login'
		}

		try {
			const response = await api.post('/login_ok.php', payload, { headers: header })

			console.log(response)
		} catch (error) {
			console.error('로그인 실패:', error)
		}
	}


	async getInverter(code: string): Promise<IInverter[]> {
		try {
			const apiUrl = `http://www.cmsolar.kr/plant/sub/idx_ok.php?mode=getPlant`

			const header = {
				'Host': 'www.cmsolar.kr',
        'Referer': 'http://www.cmsolar.kr/plant/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://www.cmsolar.kr',
        'Content-Type': 'application/json'
			}

			const response = await api.get(apiUrl, { headers: header })
			console.log(response)
			

			let json = []
			// if (response.data?.response?.data?.inverters) {
			// 	json = response.data?.response?.data?.inverters
			// }

			// return json.map((inv: any, idx: number) => ({
			// 	no: idx + 1,
			// 	run: this.convertRunStatus(inv.run_status.toString()),
			// 	pwr: Math.floor(inv.output_power),
			// 	day: Math.floor(inv.daily),
			// 	yld: Math.floor(inv.total),
			// }))
			return json
		} catch (error) {
			throw new Error(error as string)
		}
	}

	async crawlling(): Promise<IGrid[]> {
		await this.login()
		await this.getInverter('123')

		const result: IGrid[] = []
		// for (const info of this.infos!) {
		// 	const invs = await this.getInverter(info.code)
		// 	const power = invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0)
		// 	const dayyld = invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0)

		// 	console.log(invs)
			
		// 	// monitoring.push({
		// 	// 	alias: info.alias,
		// 	// 	pwr: power,
		// 	// 	day: dayyld,
		// 	// 	invs: invs,
		// 	// })
		// }
		return result
	}




	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}
}
