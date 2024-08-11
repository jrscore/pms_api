import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { ISiteInfo, MonitModel } from '../model/monit_model'
import { JsonDoc } from '../model/jsondoc'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteInfos } from '../firebase/r_site_info'
import * as cheerio from 'cheerio'



// axios 기본 설정
const header = {
	'Host': 'www.solar.mrt.co.kr',
	'Origin': 'http://www.solar.mrt.co.kr',

	'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,,application/signed-exchangev=b3q=0.7',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language': 'ko-KR,koq=0.9,en-USq=0.8,enq=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
	'User-Agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7)'
}

const Axios = wrapper(axios.create({
	baseURL: 'http://www.solar.mrt.co.kr',
	withCredentials: true,
	headers: header,
	jar: new CookieJar()
}))



export class MrtBot implements Bot {

	private loginUrl = `https://solar.mrt.co.kr/api/member/login`	
	private logoutUrl = `http://www.solar.mrt.co.kr/index.php?PID=9902`	
	private apiUrl = `https://solar.mrt.co.kr/api/measurement?deviceUid=null`	
	private sites: ISiteInfo[] = []
	private gridList: IGrid[] = []


	async initialize(cid:string) {
		this.sites = await getSiteInfos(cid, 'mrt')// this.model = await getMonitModel('dass') ?? this.model
	}


	async crawlling(): Promise<IGrid[]> {
		for (const site of this.sites) {
			if (typeof site.memo === 'object' && site.memo !== null) {
				await this.login(site.memo.id, site.memo.pwd)
			}
			const invs = await this.getInverter()
			this.gridList.push({
				alias: site.alias,
				pwr: invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0),
				day: invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0),
				invs: invs,
			})
			await this.logout()
		}
		return this.gridList
	}


	async logout(): Promise<void> {
		try {
			await Axios.get(this.logoutUrl)
			console.log('로그아웃=========')
		} catch (error) {
			console.log(error)
		}
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = { id: id, password: pwd }
			const response = await Axios.post( this.loginUrl, payload, { headers: header })
			console.error('MRT LOGIN')
			console.error(response)
		} catch (error) {
			console.error('MRT LOGIN 실패:', error)
		}
	}


	async getInverter(): Promise<IInverter[]> {
		try {
			const response = await Axios.get(this.apiUrl)
			const $ = cheerio.load(response.data)

			const invs: IInverter[] = $('table.se_list1 tbody tr').map((idx, el) => {
				return {
					no:  parseInt( $(el).find('td').eq(0).text().trim(), 10),
					pwr: parseInt( $(el).find('td').eq(4).text().trim(), 10),
					day: parseInt( $(el).find('td').eq(7).text().trim(), 10),
					yld: parseInt( $(el).find('td').eq(8).text().trim(), 10),
					run: true
				}
			}).get()
			console.log('인버터데이터',invs)
			
			return invs
		} catch (error) {
				throw new Error(error instanceof Error ? error.message : 'Unknown error')
		}
	}


	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}

}