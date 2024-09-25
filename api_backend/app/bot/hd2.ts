import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'
import { hdRunstate } from '../utils/util'


const header = {
	'Host':						'hs3.hyundai-es.co.kr',
	'Origin':					'https://hs3.hyundai-es.co.kr',
	'Referer':				'https://hs3.hyundai-es.co.kr',
	'Connection':			'keep-alive',
	'Content-Type':		'application/json',
	'Accept':					'application/json, text/plain, */*',
	'User-Agent': 		'Chrome/126.0.0.0 Safari/537.36',

	'X-APIVERSION': 'v1.0',
	'X-APP': 'HIWAY4VUETIFY',
	'X-Auth-Token': 'null',
	'X-CALLTYPE': '0',
	'X-CHANNEL': 'WEB_PCWeb',
	'X-LANG': 'ko',
	'X-LOGKEY': '2024070623492385023IWPMY4VUETIFY7079',
	'X-MID': 'login',
	'X-VNAME': 'UI',
}


export class HdBot implements Bot {

	private baseUrl = 'https://hs3.hyundai-es.co.kr'
	private loginUrl = '/hismart/login'
	private apiUrl = '/hismart/monitoring/site'

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance


	async initialize(cid:string) {
		this.model = await getMonitModel('hd') ?? this.model
		this.sites = await getSiteList(cid, 'hd')
		
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()
		}))
	}


	async crawlling(): Promise<GridData[]> {
		await this.login(this.sites[0].id, this.sites[0].pwd)
		const gridList: GridData[] = []
		await this.fetchGrid(this.sites[0])
		// for (const site of this.sites) {
		// 	const grid = await this.fetchGrid(site)
		// 	gridList.push(grid)
		// }
		return gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = {user_id: id, password: pwd }
			await this.Axios.post(this.loginUrl, payload, { headers: header })
		} catch (error) {
			console.error('HD LOGIN 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		try {
			const response = await this.Axios.get( `${this.apiUrl}/${site.code}/inverter` )
			const inverters = response.data.response.datas.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: hdRunstate(inv.run_status.toString()),
				pwr: Math.floor(inv.PVPCS_Pac),
				day: Math.floor(inv.PVPCS_Daily_P),
				yld: 0,
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
			console.error('HD Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}
}