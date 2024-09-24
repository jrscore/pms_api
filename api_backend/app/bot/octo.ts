import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'
import { generateTimeBasedOnNow } from '../utils/util'



const header = {
	'Host':						'www.octo.co.kr',
	'Origin':					'https://www.octo.co.kr',
	'Referer':				'https://www.octo.co.kr',
	'Accept':					'application/json, text/plain, */*',
	'Content-Type':		'application/json',
}



export class OctoBot implements Bot {

	private baseUrl = 'https://emsapi.atlasconn.com:12443/api/v1'
	private loginUrl = `${this.baseUrl}/authority/login`
	private apiUrl = '/inverter/data'

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance
	private _token = ''


	async initialize(cid:string) {
		this.model = await getMonitModel('octo') ?? this.model
		this.sites = await getSiteList(cid, 'octo')
		
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()// headers: header,
		}))
	}


	async crawlling(): Promise<GridData[]> {
		await this.login(this.sites[0].id, this.sites[0].pwd)
		const gridList: GridData[] = []
		for (const site of this.sites) {
			const grid = await this.fetchGrid(site)
			gridList.push(grid)
		}
		return gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		const payload = {
			userId: 	this.sites[0].id,
			userPass:	this.sites[0].pwd.toString(),
			referrer:	'ems_customer_pc_web'
		}
		try {
			const response = await this.Axios.post(this.loginUrl, payload, { headers: header })
			const data = response.data

			if (data.response?.session?.userKey) {
				this._token = data.response?.session?.userKey
			} else {
				throw Error('octo:로그인실패')
			}
			console.error("로그인 성공")
		} catch (error) {
			console.error(error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		const payload = {
			mcno: site.code,
			uKey: this._token,
			time: generateTimeBasedOnNow()
		}
		try {
			const response = await this.Axios.get(this.apiUrl, { headers: header, params: payload })
			const inverters = response.data?.response?.inverters[0]?.inverters.map((inv: any, idx: number) => ({
				no:  idx + 1,
				run: inv.isRun,
				pwr: inv.ackw,
				day: inv.dayTotal,
				yld: inv.total
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