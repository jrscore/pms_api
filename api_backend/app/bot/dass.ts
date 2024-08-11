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
const header = {
	'Host': 'iplug.dasstech.com',
	'Origin': 'http://iplug.dasstech.com',
	'Referer': 'http://iplug.dasstech.com/login',

	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,,application/signed-exchange;v=b3;q=0.7',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
}

const Axios = wrapper(axios.create({
	baseURL: 'http://iplug.dasstech.com',
	withCredentials: true,
	headers: header,
	jar: new CookieJar()
	// xsrfCookieName: 'XSRF-TOKEN',			// CSRF 토큰을 저장할 쿠키 이름 xsrfHeaderName: 'X-Csrf-Token',		// CSRF 토큰을 포함할 헤더 이름
}))



export class DassBot implements Bot {

	private apiUrl = `http://iplug.dasstech.com/monitoring/getDevelopmentSituationData.json`	
	private payload: JsonDoc | undefined
	private sites: ISiteInfo[] = []


	async initialize(cid:string) {
		this.sites = await getSiteInfos(cid, 'dass')// this.model = await getMonitModel('dass') ?? this.model
	}


	async crawlling(): Promise<IGrid[]> {

		const gridList: IGrid[] = []
		for (const site of this.sites) {
			await this.login(site.id, site.pwd)
			const invs = await this.getInverter(site.code)
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
		await Axios.get('http://iplug.dasstech.com/logout')
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = { id: id, pass: pwd }
			const response = await Axios.post('/loginRequest', payload, { headers: header })
		} catch (error) {
			console.error('DASS LOGIN 실패:', error)
		}
	}


	async getInverter(code:string): Promise<IInverter[]> {
		try {
			const payload = { SITE_CODE: code }
			const response = await Axios.post(this.apiUrl, payload, { headers: header })

			const json = response.data.inverterList
			return json.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: inv.DEVICE_STATE,
				pwr: Math.floor(parseFloat(inv.powerInfo.currentPowerGeneration)),
				day: Math.floor(parseFloat(inv.powerInfo.todayPower)),
				yld: Math.floor(parseFloat(inv.powerInfo.accumulatePower))
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}

	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}

}