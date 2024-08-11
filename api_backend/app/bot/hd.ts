import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { ISiteInfo, MonitModel } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { JsonDoc } from '../model/jsondoc'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { getSiteInfos } from '../firebase/r_site_info'

export class HdBot implements Bot {

	private ax = wrapper(axios.create({ jar: new CookieJar() })) // Axios 인스턴스에 쿠키 지원 추가
	
	private payload: JsonDoc | undefined
	private model: MonitModel = {} as MonitModel
	private sites: ISiteInfo[] = []

	private headers = {
			'Host': 'hs3.hyundai-es.co.kr',
			'Origin': 'https://hs3.hyundai-es.co.kr',
			'Referer': 'https://hs3.hyundai-es.co.kr/',
			'Accept': 'application/json, text/plain, */*',
			'Accept-Encoding': 'gzip, deflate, br, zstd',
			'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			'Connection': 'keep-alive',
			'Content-Type': 'application/json',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
			'X-APIVERSION': 'v1.0',
			'X-APP': 'HIWAY4VUETIFY',
			'X-Auth-Token': 'null',
			'X-CALLTYPE': '0',
			'X-CHANNEL': 'WEB_PCWeb',
			'X-LANG': 'ko',
			'X-LOGKEY': '2024070623492385023IWPMY4VUETIFY7079',
			'X-MID': 'login',
			'X-VNAME': 'UI',
			'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"'
		}
	

	async initialize(cid:string) {
		this.model = await getMonitModel('hd') ?? this.model
		this.sites = await getSiteInfos(cid, 'hd')
		this.payload = {
			user_id:  this.sites[0].id,
			password: this.sites[0].pwd.toString(),
		}
	}


	async crawlling(): Promise<IGrid[]> {
		await this.login()
		const monitoring: IGrid[] = []

		for (const info of this.sites!) {
			const invs = await this.getInverter(info.code)
			monitoring.push({
				alias: info.alias,
				pwr: invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0),
				day: invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0),
				invs: invs,
			})
		}
		return monitoring
	}


	async login(): Promise<void> {
		try {
			const response = await this.ax.post(`${this.model.url}/hismart/login`, this.payload, {
				headers: this.headers,
				withCredentials: true
			})
			console.log("로그인 성공");console.log("Cookies:", response.headers['set-cookie'])
		} catch (error) {
			console.error('로그인 실패:', error)
		}
	}


	async getInverter(sitecode: string): Promise<IInverter[]> {
		try {
			const apiUrl = `${this.model.url}/hismart/monitoring/site/${sitecode}/inverter`
			const response = await this.ax.get(apiUrl, {
				headers: this.headers,
				withCredentials: true
			})

			let json = []
			if (response.data?.response?.datas) {
				json = response.data.response.datas
			}

			return json.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: this.convertRunStatus(inv.run_status.toString()),
				pwr: Math.floor(inv.PVPCS_Pac),
				day: Math.floor(inv.PVPCS_Daily_P),
				yld: 0,
			}))
		} catch (error) {
			throw new Error(error as string)
		}
	}

	convertRunStatus(status: string): boolean {
    return status.toLowerCase() === 'running'
	}
}
