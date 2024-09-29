import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { Inverter, GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList as getSiteList } from '../firebase/r_site_info'


const baseUrl = 'http://www.cmsolar.kr'

const header = {
	'Host': 					'www.cmsolar.kr',
	'Origin': 				'http://www.cmsolar.kr',
	'Referer': 				'http://www.cmsolar.kr/login.php',

	'User-Agent':			'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7)',
	'Content-Type':		'application/x-www-form-urlencoded',

	'Accept':						'text/html,application/xhtml+xml,application/xmlq=0.9,,application/signed-exchangev=b3q=0.7',
	'Accept-Encoding':	'gzip, deflate',
	'Accept-Language':	'ko-KR,koq=0.9,en-USq=0.8,enq=0.7',
}
const runState = (status: string) => status.toLowerCase() === 'running'



export class CmBot implements Bot {

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []

	private apiUrl = `http://www.cmsolar.kr/plant/sub/idx_ok.php?mode=getPlant`	
	private Axios!: AxiosInstance

	async initialize(cid:string) {
		this.model = await getMonitModel('cm') ?? this.model
		this.sites = await getSiteList(cid, 'cm')
		
		this.Axios = wrapper(axios.create({
			baseURL: baseUrl,
			withCredentials: true,
			headers: header,
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
		const tmp = {
			'Cache-Control': 'max-age=0',
			'Connection' : 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
		}
		try {
			const payload = { id: id, pw: pwd, commit: 'Login' }
			await this.Axios.post('/login_ok.php', payload, { headers: {...header, ...tmp} })
			await new Promise<void>(s => setTimeout(s, 1000))
		} catch (error) {
			console.error('CM 로그인 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		const h2 = {
			'Content-Type':			'application/json',
			'Accept': 					'application/json, text/plain, */*',
			'X-Requested-With':	'XMLHttpRequest',
		}		
		try {
			const result = await this.Axios.get(this.apiUrl, { headers: { ...header, ...h2 } })

			// 인버터
			const inverters = result.data[0].power.map(el => ({
				no: el.dev_deviceid,
				run: runState(el.dev_stat2),
				pwr: ~~(el.pow_ac_p / 1000),
				day: ~~(el.pow_today / 1000),
				yld: ~~(el.pow_thismonth / 1000),
			}))
			// Grid
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}
		} catch (err) {
			console.error('CM 인버터 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}

}