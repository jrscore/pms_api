import axios from 'axios'
import { Bot } from './factory'
import { Inverter, GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { JsonDoc } from '../model/jsondoc'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList } from '../firebase/r_site_info'
import { error } from 'console'

// axios 기본 설정
const header = {
	'Host': 'nrems.co.kr',
	'Origin': 'http://nrems.co.kr',

	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,,application/signed-exchange;v=b3;q=0.7',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
}

const Axios = wrapper(axios.create({
	baseURL: 'http://nrems.co.kr',
	withCredentials: true,
	headers: header,
	jar: new CookieJar()
	// xsrfCookieName: 'XSRF-TOKEN',			// CSRF 토큰을 저장할 쿠키 이름 xsrfHeaderName: 'X-Csrf-Token',		// CSRF 토큰을 포함할 헤더 이름
}))



export class RemsBot implements Bot {

	private loginUrl = `/login_chk.php`	
	private logoutUrl = `/logout.php`	
	private apiUrl = `/v2/local/proc/index_proc.php`	
	private sites: SiteInfo[] = []
	private gridList: GridData[] = []


	async initialize(cid:string) {
		this.sites = await getSiteList(cid, 'rems')// this.model = await getMonitModel('dass') ?? this.model
	}


	async crawlling(): Promise<GridData[]> {

		for (const site of this.sites) {
			if (typeof site.memo === 'object' && site.memo !== null) {
				await this.login(site.memo.id, site.memo.pwd)
			}
			const invs = await this.getInverter(site.code)
			this.gridList.push({
				alias: site.alias,
				pwr: invs.reduce((sum, inv) => sum + inv.pwr, 0),
				day: invs.reduce((sum, inv) => sum + inv.day, 0),
				invs: invs,
			})
			await this.logout()
		}
		return this.gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = { act:'loginChk',  user_id: id, user_pw: pwd }
			const response = await Axios.post(this.loginUrl, payload, { headers: header })
			if(response.status !== 200)
				throw new error('REMS LOGIN 실패:')
		} catch (error) {
			console.error('REMS LOGIN 실패:', error)
		}
	}


	async logout(): Promise<void> {
		await Axios.get(this.logoutUrl)
	}


	async getInverter(code:string): Promise<Inverter[]> {
		try {
			const payload = { act:'empty', pscode: code }
			const response = await Axios.post(this.apiUrl, payload, { headers: header })
			const invs = response.data.ivt_value

			return invs.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: inv.DEVICE_STATE,
				pwr: parseInt(inv.curKW),
				day: 0,
				yld: parseInt(inv.KWH)
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}

	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}

}