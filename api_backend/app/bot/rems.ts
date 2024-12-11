import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { MonitResult } from '../model/monit_result'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'
import { delay } from '../utils/util'


const header = {
	'Host':						'nrems.co.kr',
	'Origin':					'http://nrems.co.kr',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,,application/signed-exchange;v=b3;q=0.7',
	'Content-Type': 'application/x-www-form-urlencoded',
}


export class RemsBot implements Bot {

	private baseUrl = 'http://nrems.co.kr'
	private loginUrl = `/login_chk.php`
	private apiUrl = '/v2/local/proc/index_proc.php'
	private gridList: MonitResult[] = []

	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance


	async crawlling(cid:string): Promise<MonitResult[]> {
		// Init
		this.sites = await getSiteList(cid, 'rems')
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()
		}))

		//크롤링		
		await this.login(this.sites[0].id, this.sites[0].pwd)
		for (const site of this.sites) {
			this.gridList.push(await this.fetchGrid(site))
		}
		return this.gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = { act:'loginChk',  user_id: id, user_pw: pwd }
			await this.Axios.post(this.loginUrl, payload, { headers: header })
			delay(1000)
		} catch (error) {
			console.error('REMS LOGIN 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<MonitResult> {
		try {
			delay(1000)
			const payload = { act:'empty', pscode: site.code }
			const response = await this.Axios.post(this.apiUrl, payload, { headers: header })
			const inverters = response.data.ivt_value.map((inv: any, idx: number) => ({
				no:		idx + 1,
				run:	true,
				pwr:	parseInt(inv.KW),
				day:	0,
				yld:	parseInt(inv.KWH)
			}))

			// debug
			inverters.forEach(it => console.log(JSON.stringify(it, null, 2)))

			// Grid
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}
		} catch (err) {
			console.error('REMS 에러:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}
}