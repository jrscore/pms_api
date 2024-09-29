import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'


const header = {
	'Host':						'nrems.co.kr',
	'Origin':					'http://nrems.co.kr',
	// 'Referer':				'https://www.octo.co.kr',
	// 'Accept':					'application/json, text/plain, */*',
	// 'Content-Type':		'application/json',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,,application/signed-exchange;v=b3;q=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
}


export class RemsBot implements Bot {

	private baseUrl = 'http://nrems.co.kr'
	private loginUrl = `/login_chk.php`
	private apiUrl = '/v2/local/proc/index_proc.php'

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance


	async initialize(cid:string) {
		this.model = await getMonitModel('rems') ?? this.model
		this.sites = await getSiteList(cid, 'rems')
		
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()
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
		try {
			const payload = { act:'loginChk',  user_id: id, user_pw: pwd }
			await this.Axios.post(this.loginUrl, payload, { headers: header })
			await new Promise<void>(s => setTimeout(s, 1000))
		} catch (error) {
			console.error('REMS LOGIN 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		try {
			const payload = { act:'empty', pscode: site.code }
			const response = await this.Axios.post(this.apiUrl, payload, { headers: header })
			const inverters = response.data.ivt_value.map((inv: any, idx: number) => ({
				no:		idx + 1,
				run:	true,
				pwr:	parseInt(inv.KW),
				day:	0,
				yld:	parseInt(inv.KWH)
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
			console.error('REMS Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}
}