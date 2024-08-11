import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { ISiteInfo, MonitModel } from '../model/monit_model'
import { JsonDoc } from '../model/jsondoc'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteInfos } from '../firebase/r_site_info'

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

const Axios = wrapper(axios.create({
	baseURL: 'http://www.cmsolar.kr',
	withCredentials: true,
	headers: header,
	jar: new CookieJar()
	// xsrfCookieName: 'XSRF-TOKEN',			// CSRF 토큰을 저장할 쿠키 이름 xsrfHeaderName: 'X-Csrf-Token',		// CSRF 토큰을 포함할 헤더 이름
}))



export class CmBot implements Bot {

	private apiUrl = `http://www.cmsolar.kr/plant/sub/idx_ok.php?mode=getPlant`	
	private payload: JsonDoc | undefined
	private model: MonitModel = {} as MonitModel
	private sites: ISiteInfo[] = []


	async initialize(cid:string) {
		this.model = await getMonitModel('cm') ?? this.model
		this.sites = await getSiteInfos(cid, 'cm')
	}


	async crawlling(): Promise<IGrid[]> {

		const gridList: IGrid[] = []
		
		for (const site of this.sites) {
			await this.login(site.id, site.pwd)
			const invs = await this.getInverter()
			gridList.push({
				alias: site.alias,
				pwr: invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0),
				day: invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0),
				invs: invs,
			})
			await this.logout()
		}
		return gridList
	}


	async logout(): Promise<void> {
		await Axios.get('http://cmsolar.kr/logout.php')
	}

	async login(id:string, pwd:string): Promise<void> {
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

		try {
			const payload = { id: id, pw: pwd, commit: 'Login' }
			const response = await Axios.post('/login_ok.php', payload, { headers: header })
		} catch (error) {
			console.error('CM 로그인 실패:', error)
		}
	}


	async getInverter(): Promise<IInverter[]> {
		let json = []
		
		try {
			const header = {
				'Host': 'www.cmsolar.kr',
        'Referer': 'http://www.cmsolar.kr/plant/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://www.cmsolar.kr',
        'Content-Type': 'application/json'
			}
			const response = await Axios.get(this.apiUrl, { headers: header })

			if (response.data && Array.isArray(response.data) && response.data.length > 0) {
				json = response.data[0]?.power
			}

			return json.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: this.convertRunStatus(inv.dev_stat2), // 'dev_stat2' 값을 사용하여 상태 변환
				pwr: Math.floor(inv.pow_totalpower),      // 'pow_totalpower'를 사용하여 출력 전력 변환
				day: Math.floor(inv.pow_today),           // 'pow_today'를 사용하여 일일 전력 변환
				yld: Math.floor(inv.pow_thisyear)         // 'pow_thisyear'를 사용하여 연간 전력 변환
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}



	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}

}