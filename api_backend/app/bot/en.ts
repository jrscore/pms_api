import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { Inverter, GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'



const header = {
	'Host':						'iplug.dasstech.com',
	'Origin':					'http://iplug.dasstech.com',
	'Referer':				'http://iplug.dasstech.com/login',

	'User-Agent':			'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7)',
	'Content-Type':		'application/x-www-form-urlencoded',

	'Accept':						'text/html,application/xhtml+xml,application/xmlq=0.9,,application/signed-exchangev=b3q=0.7',
	'Accept-Encoding':	'gzip, deflate',
	'Accept-Language':	'ko-KR,koq=0.9,en-USq=0.8,enq=0.7',
}
const runState = (status: string) => status.toLowerCase() === 'running'



export class EnsearchBot implements Bot {

	private baseUrl = 'http://ensearchsun.com'
	private loginUrl = `/login.solar`
	private apiUrl = `/inverter_status`

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance


	async initialize(cid:string) {
		this.model = await getMonitModel('en') ?? this.model
		this.sites = await getSiteList(cid, 'en')
		
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()// headers: header,
		}))
	}


	async crawlling(): Promise<GridData[]> {
		// 로그인
		await this.login(this.sites[0].id, this.sites[0].pwd)

		const gridList: GridData[] = []
		for (const site of this.sites) {
			const grid = await this.fetchGrid(site)
			gridList.push(grid)
		}
		return gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			await this.Axios.post(this.loginUrl, { userid: id, userpw: pwd } )
		} catch (error) {
			console.error('EN 로그인 실패:')
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		try {

			const response = await this.Axios.post(this.apiUrl, {'field':site.code})
			// 인버터
			const inverters = response.data.map((inv: any, idx: number) => ({
				no:  idx + 1,
				run: inv.fault,
				pwr: Math.floor(inv.now_energy),
				day: 0,
				yld: 0
			}))

			inverters.map(it => console.log(it))

			// Grid
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}
		} catch (err) {
			console.error('En Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}

}