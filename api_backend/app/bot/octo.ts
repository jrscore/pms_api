import axios from 'axios'
import { generateTimeBasedOnNow } from '../utils/util'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { ISiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { JsonDoc } from '../model/jsondoc'
import { getSiteInfos } from '../firebase/r_site_info'


export class OctoBot implements Bot {

	private ax = axios.create()
	private _token = ''

	private model: MonitModel = {} as MonitModel
	private sites: ISiteInfo[] = []
	private payload: JsonDoc | undefined
	private headers: JsonDoc = {
		'Content-Type': 'application/json',
		'Accept': `application/json, text/plain, */*`,
		'Origin': 'https://www.octo.co.kr',
		'Referer': 'https://www.octo.co.kr/',
	}


	async initialize(cid:string) {

		this.model = await getMonitModel('octo') ?? this.model
		this.sites = await getSiteInfos(cid, 'octo')
		//const modelResult = await getMonitModel('octo');this.model = modelResult ?? this.model;const siteInfos = await getSiteInfos(cid, 'octo');this.sites = siteInfos
		this.payload = {
			userId: 	this.sites[0].id,
			userPass:	this.sites[0].pwd.toString(),
			referrer:	'ems_customer_pc_web'
		}
	}


	get isLogin(): boolean {
		return !!this._token
	}

	
	async crawlling (): Promise<IGrid[]> {
			
		await this.login()
		const monitoring: IGrid[] = []

		for (const info of this.sites!) {
			const invs = await this.getInverter(info.code)
			const power = invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0)
			const dayyld = invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0)

			monitoring.push({
				alias: info.alias,
				pwr: power,
				day: dayyld,
				invs: invs
			})
		}
		return monitoring
	}


	async login(): Promise<void> {
		try {
			const data = (await this.ax.post(`${this.model.url}/authority/login`, this.payload, { headers: this.headers })).data

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


	async getInverter(sitecode:string): Promise<IInverter[]> {
		try {
			const apiUrl = `${this.model.url}/inverter/data`
			const payload = {
				mcno: sitecode,
				uKey: this._token,
				time: generateTimeBasedOnNow()
			}

			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload })

			let json = []
			if (response.status === 200 && response.data?.response?.inverters[0]?.inverters) {
				json = response.data?.response?.inverters[0]?.inverters
			}

			return json.map((inv: any, idx: number) => ({
				no:  idx + 1,
				run: inv.isRun,
				pwr: Math.floor(inv.pwr),
				day: Math.floor(inv.day),
				yld: Math.floor(inv.yld)
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}
}


