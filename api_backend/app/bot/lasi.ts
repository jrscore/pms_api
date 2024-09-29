import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { GridData } from '../model/grid'
import { MonitModel, SiteInfo } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { getSiteList } from '../firebase/r_site_info'
import { hdRunstate, LaseeRunstate } from '../utils/util'
import * as cheerio from 'cheerio'


const header = {
	'Origin':					'https://www.lasee.io',
	'Referer':				'https://www.lasee.io/',
	'Connection':			'keep-alive',
	'Content-Type':		'application/x-www-form-urlencoded; charset=UTF-8',
	'Accept':					'text/html,application/xhtml+xml,application/xml;q=0.9,,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	'User-Agent': 		'Chrome/126.0.0.0 Safari/537.36',
	'X-Requested-With': 'XMLHttpRequest',
	'sec-ch-ua': "Google Chrome;v=129, Not=A?Brand;v=8, Chromium;v=129",
	'sec-ch-ua-mobile':'?0',
	'sec-ch-ua-platform':"macOS",
	'sec-fetch-dest':'empty',
	'sec-fetch-mode':'cors',
	'sec-fetch-site':'same-origin',
}


export class LaseeBot implements Bot {
	private baseUrl		= 'https://www.lasee.io'
	private loginUrl	= '/auth/login'
	private apiUrl 		= '/plant'

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance
	private jar: CookieJar
	private csrfToken?: string



	async initialize(cid:string) {
		this.model = await getMonitModel('lasee') ?? this.model
		this.sites = await getSiteList(cid, 'lasee')
		
		this.jar = new CookieJar()
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: this.jar
		}))

		this.Axios.interceptors.request.use((config) => {
			if (this.csrfToken) {
				config.headers['x-csrf-token'] = this.csrfToken
			}
			return config
		}, (error) => Promise.reject(error))
	}

	async crawlling(): Promise<GridData[]> {
		await this.login(this.sites[0].id, this.sites[0].pwd)
		const gridList: GridData[] = []
		for (const site of this.sites) {
			const grid = await this.fetchGrid(site)
			gridList.push(grid)
			await new Promise<void>(s => setTimeout(s, 1000))
		}
		return gridList
	}


	async login(id:string, pwd:string): Promise<void> {
		try {
			const payload = {name: id, password: pwd }
			await this.Axios.post(this.loginUrl, payload, { headers: header })
			await new Promise<void>(s => setTimeout(s, 1000))
			await this.fetchCsrfToken()
		} catch (error) {
			console.error('LASEE LOGIN 실패:', error)
		}
	}

	// 메타 태그에서 CSRF 토큰 추출
	async fetchCsrfToken(): Promise<void> {
		try {
			const response = await this.Axios.get('/plant/6490', {headers:header, withCredentials:true})
			const html = response.data
			const $ = cheerio.load(html)

			this.csrfToken = $('meta[name="csrf-token"]').attr('content')
			if (!this.csrfToken) {
				throw new Error('CSRF 토큰ERR')
			}
			console.log('CSRF Token:', this.csrfToken)
		} catch (error) {
			console.error('CSRF 토큰 추출 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		const headers = {
			'Accept': 					'application/json, text/javascript, */*; q=0.01',
			'Origin': 					'https://www.lasee.io',
			'Referer': 					'https://www.lasee.io/plant/6490',
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 		'application/x-www-form-urlencoded; charset=UTF-8',
			'User-Agent': 		'Chrome/126.0.0.0 Safari/537.36',
		}
		try {
			const payload = {check2:92}
			const response = await this.Axios.post( `${this.apiUrl}/${site.code}/966/inverter_status/data`, payload, {headers:headers, withCredentials: true})
			const inverters = response.data.data.inverters.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: LaseeRunstate(inv.invert_status),
				pwr: inv.output_power,
				day: inv.daily,
				yld: 0,
			}))


			// Grid
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}
		} catch (err) {
			console.error('Lasee Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}
}
