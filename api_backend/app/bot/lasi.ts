import axios from 'axios'
import { Bot } from './factory'
import { IInverter, IGrid } from '../model/grid'
import { ISiteInfo } from '../model/monit_model'
import { getMonitModel } from '../firebase/r_mnt_model'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { URLSearchParams } from 'url'

// axios 기본 설정
const axiosService = wrapper(axios.create({
	timeout: 60000,
	baseURL: 'https://www.lasee.io',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding': 'gzip, deflate, br, zstd',
		'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
		'Cache-Control': 'max-age=0',
		'Origin': 'https://www.lasee.io',
		'Referer': 'https://www.lasee.io/2991',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
		'Sec-Fetch-Site': 'same-origin',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-User': '?1',
		'Sec-Fetch-Dest': 'empty',
		'Upgrade-Insecure-Requests': '1',
		'X-Requested-With': 'XMLHttpRequest',
	},
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-Csrf-Token',
	jar: new CookieJar()
}))

export class LaseeBot implements Bot {
	private url: string = ''
	private sites: ISiteInfo[]

	constructor(sites:ISiteInfo[]){
		this.sites = sites
		this.initialize()
	}


	async initialize() {
		const model = await getMonitModel('lasee')
		if (model) {
			this.url = model.url
		}
		axiosService.defaults.baseURL = this.url
	}

	async crawlling(): Promise<IGrid[]> {
		await this.login()

		const monitoring: IGrid[] = []

		for (const info of this.sites!) {
			const invs = await this.getInverter(info.code)
			const power = invs.reduce((sum, inv) => sum + Math.floor(inv.pwr), 0)
			const dayyld = invs.reduce((sum, inv) => sum + Math.floor(inv.day), 0)

			console.log(invs)
			

			// monitoring.push({
			// 	alias: info.alias,
			// 	pwr: power,
			// 	day: dayyld,
			// 	invs: invs,
			// });
		}

		return monitoring
	}

	async login(): Promise<void> {
		const payload = new URLSearchParams({
			name: this.sites![0].id,
			password: this.sites![0].pwd.toString(),
		})

		try {
			const response = await axiosService.post('/auth/login', payload.toString());
			console.log('로그인 성공');
			console.log('Cookies:', response.headers['set-cookie']);
		} catch (error) {
			console.error('로그인 실패:', error);
		}
	}

	async getInverter(code: string): Promise<IInverter[]> {
		try {
			const apiUrl = `${this.url}/plant/${code}/966/inverter_status/data`;
			console.log(apiUrl);

			const response = await axiosService.post(apiUrl);

			let json = [];
			if (response.data?.response?.data?.inverters) {
				json = response.data?.response?.data?.inverters;
			}

			return json.map((inv: any, idx: number) => ({
				no: idx + 1,
				run: this.convertRunStatus(inv.run_status.toString()),
				pwr: Math.floor(inv.output_power),
				day: Math.floor(inv.daily),
				yld: Math.floor(inv.total),
			}));
		} catch (error) {
			throw new Error(error as string);
		}
	}

	convertRunStatus(status: string): boolean {
		return status.toLowerCase() === 'running';
	}
}
