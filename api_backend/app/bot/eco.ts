import axios, { AxiosInstance } from 'axios'
import { Bot } from './factory'
import { Inverter, GridData } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { SiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList } from '../firebase/r_site_info'
import * as cheerio from 'cheerio'
import { log } from 'console'


const baseUrl = 'http://www.ecogreentech.kr'

const header = {
	'Host':						'www.ecogreentech.kr',
	'Origin':					'http://www.ecogreentech.kr',
	'Referer':				'http://iplug.dasstech.com/login',

	'User-Agent':			'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7)',
	'Content-Type':		'application/x-www-form-urlencoded',

	'Accept':						'text/html,application/xhtml+xml,application/xmlq=0.9,,application/signed-exchangev=b3q=0.7',
	'Accept-Encoding':	'gzip, deflate',
	'Accept-Language':	'ko-KR,koq=0.9,en-USq=0.8,enq=0.7',
}
const runState = (status: string) => status.toLowerCase() === 'running'



export class EcoBot implements Bot {

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []

	private apiUrl = `${baseUrl}/index.php?PID=02`
	private Axios!: AxiosInstance

	async initialize(cid:string) {
		this.model = await getMonitModel('eco') ?? this.model
		this.sites = await getSiteList(cid, 'eco')
		
		this.Axios = wrapper(axios.create({
			baseURL: baseUrl,
			withCredentials: true,
			headers: header,
			jar: new CookieJar()
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
			const payload = { action: 'loginOK', userID: id, userPass: pwd, x: '252', y: '41' }
			const response = await this.Axios.post('/index.php?PID=', payload, { headers: header })
			await new Promise<void>(s => setTimeout(s, 1000))
		} catch (error) {
			console.error('ECO LOGIN 실패:', error)
		}
	}


	async fetchGrid(site:SiteInfo): Promise<GridData> {
		try {
			const response = await this.Axios.post(this.apiUrl)
			const $ = cheerio.load(response.data)

			// 인버터
			const inverters = $('table.se_list1 tbody tr').map((i, el) => {
				return {
					no:  parseInt( $(el).find('td').eq(0).text().trim(), 10),
					pwr: parseInt( $(el).find('td').eq(4).text().trim(), 10),
					day: parseInt( $(el).find('td').eq(7).text().trim(), 10),
					yld: parseInt( $(el).find('td').eq(8).text().trim(), 10),
					run: true
				}
			}).get()

			console.log(`${site.alias}`)
			inverters.map( it => console.log(`${it}`) )
			
			// Grid
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}

		} catch (err) {
			console.error('Dass Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}

}