import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { ISiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteInfos } from '../firebase/r_site_info'


// axios 기본 설정

export class EnsearchBot implements Bot {

	private baseURL = 'http://ensearchsun.com'
	private loginUrl = `/login.solar`	
	private lgoutUrl = `/logout.php`	
	private apiUrl = `/inverter_status`
	
	private sites: ISiteInfo[] = []
	private model: MonitModel = {} as MonitModel
	private gridList: IGrid[] = []


	private Axios = wrapper(axios.create({
		baseURL: this.baseURL,
		withCredentials:true, 
		jar: new CookieJar()
	}))


	async initialize(cid:string) {
		this.model = await getMonitModel('en') ?? this.model
		this.sites = await getSiteInfos(cid, 'en')
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


	async login(id:string, pwd:string): Promise<void> {
		try {
			await this.Axios.post(this.loginUrl, { userid: id, userpw: pwd } )
		} catch (error) {
			console.error('EN 로그인 실패:')
		}
	}


	async logout(): Promise<void> {
		await this.Axios.get(this.lgoutUrl)
	}


	async getInverter(code:string): Promise<IInverter[]> {	
		try {
			const response = await this.Axios.post(this.apiUrl, {'field':code})
			console.log(response.data)
			
			return response.data.map((inv: any, idx: number) => ({
				no:  idx + 1,
				run: inv.fault,
				pwr: Math.floor(inv.energy),
				day: Math.floor(inv.now_energy),
				yld: 0
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}


	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running'
	}

}