import axios from 'axios'
import { generateTimeBasedOnNow } from '../utils/util'
import { Bot } from './factory'
import { Inverter, GridData } from '../model/grid'


export class ObBot implements Bot {

	private url = 'https://emsapi.atlasconn.com:12443/api/v1'
	private id 	= 'obgwangju_aeonus_3'
	private pwd = '7101'
	private sitecode = 6792
	private _token = ''
	private ax = axios.create()
	private headers: { [key: string]: string } = {}
	private payload: { [key: string]: string } = {}


	async initialize() {
		this.headers = {
			'Accept': `application/json, text/plain, */*`,
			'Content-Type': 'text/plain',
			'Origin': 'https://www.octo.co.kr',
			'Referer': 'https://www.octo.co.kr/',
		}

		this.payload = {
			userId: 	this.id,
			userPass:	this.pwd,
			referrer:	'ems_customer_pc_web'
		}
	}


	get isLogin(): boolean {
		return !!this._token
	}

	
	async crawlling(): Promise<GridData[]> {
			
		await this.login()
		const invs = await this.getInverter()

		// 인버터에서 pwr, day의 합계 계산
		const power = invs.reduce((sum, inv) => sum + inv.pwr, 0)
		const dayyld = invs.reduce((sum, inv) => sum + inv.day, 0)

		return [{
			alias: 'OB맥주',
			pwr: power,
			day: dayyld,
			invs: invs
		}]

	}


	async login(): Promise<boolean> {
		try {
			const data = (await this.ax.post(`${this.url}/authority/login`, this.payload, { headers: this.headers })).data

			if (data.response?.session?.userKey) {	// => optional chaining
				this._token = data.response?.session?.userKey
			}
			await new Promise<void>(s => setTimeout(s, 1000))
			console.error("로그인 성공")
			return true
		} catch (error) {
			console.error("로그인에러", error)
			return false
		}
	}


	async getInverter(): Promise<Inverter[]> {
		try {
			const apiUrl = `${this.url}/inverter/data`
			const payload = {
				mcno: this.sitecode,
				uKey: this._token,
				time: generateTimeBasedOnNow()
			}

			console.log(apiUrl)
			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload })

			console.log(response)
			

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







// export class OCTO_Crawler {

// 	private url = 'https://emsapi.atlasconn.com:12443/api/v1'
// 	private id = 'obgwangju_aeonus_3'
// 	private pwd = '7101'
// 	private sitecode = 6792
// 	private _token = ''
// 	private ax = axios.create()
// 	private headers: { [key: string]: string } = {}

// 	get isLogin(): boolean {
// 		return !!this._token;
// 	}

// 	constructor() {
// 		this.headers = {
// 			'Accept': `application/json, text/plain, */*`,
// 			'Content-Type': 'text/plain',
// 			'Origin': 'https://www.octo.co.kr',
// 			'Referer': 'https://www.octo.co.kr/',
// 		}
// 	}

// 	async fetch(): Promise<Monit> {
// 		try {
// 			if (!this.isLogin) {
// 				await this.login()
// 			}
	
// 			const grid = null;
// 			await wait(3000)
// 			const vcb = await this.getVcb();
// 			await wait(3000)
// 			const pv = await this.getPV();
// 			await wait(3000)
// 			return { grid, vcb, pv }

// 		} catch (error) {
// 			throw new Error("FETCH 실패");
// 		}
// 	}

// 	async login(): Promise<boolean> {
// 		try {
// 			const payload = {
// 				userId: this.id,
// 				userPass: this.pwd,
// 				referrer: 'ems_customer_pc_web'
// 			}

// 			const response = await this.ax.post(`${this.url}/authority/login`, payload, { headers: this.headers });
// 			const json = response.data;
// 			if (json.response?.session?.userKey) {	// => optional chaining
// 				this._token = json.response?.session?.userKey
// 			}
// 			console.error("octo login");
// 			return true;
// 		} catch (error) {
// 			console.error("로그인실패", error);
// 			return false
// 		}
// 	}



// 	async getVcb(): Promise<Vcb> {
// 		try {
// 			const apiUrl = `${this.url}/meter/data`;
// 			const payload = {
// 				mcno: this.sitecode,
// 				uKey: this._token,
// 				time: generateTimeBasedOnNow()// time: 4156239939
// 			};

// 			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

// 			if (response.status === 200 && response.data?.response?.meter) {
// 				const json = response.data.response.meter[0]
// 				return {
// 					time: new Date(json.updatedAt),
// 					acb_yld: json.meters[0].activeKwh,
// 					vcb_yld: json.meters[2].activeKwh
// 				}
// 			} else {
// 				throw new Error("ERR: VCB");
// 			}
// 		} catch (error) {
// 			throw new Error("ERR: VCB");
// 		}
// 	}

// 	async getPV(): Promise<PV> {
// 		try {
// 			const apiUrl = `${this.url}/inverter/daytotal`;
// 			const payload = {
// 				mcno: this.sitecode,
// 				uKey: this._token,
// 				time: generateTimeBasedOnNow()
// 			};

// 			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

// 			if (response.status === 200 && response.data?.response) {
// 				const json = response.data?.response
// 				return {
// 					date: new Date(),
// 					pwr: intParser(json.ackw),
// 					day: intParser(json.dayTotal),
// 					mth: 0,
// 					yld: intParser(json.total),
// 					invs: await this.getInverter()
// 				}
// 			} else {
// 				throw new Error("ERR: PV");
// 			}
// 		} catch (error) {
// 			throw new Error("ERR: PV");
// 		}
// 	}


// 	async getInverter(): Promise<Inverter[]> {
// 		try {
// 			const apiUrl = `${this.url}/inverter/data`;
// 			const payload = {
// 				mcno: this.sitecode,
// 				uKey: this._token,
// 				time: generateTimeBasedOnNow()
// 			};

// 			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

// 			if (response.status === 200 && response.data?.response?.inverters[0]?.inverters) {
// 				const json = response.data?.response?.inverters[0]?.inverters

// 				let invs: Inverter[] = json.map((inv: any, idx: number) => ({
// 					no: idx + 1,
// 					stt: inv.isRun,
// 					dcv: intParser(inv.dcv),
// 					dca: intParser(inv.dca),
// 					pwr: intParser(inv.ackw),
// 					day: intParser(inv.dayTotal),
// 					yld: intParser(inv.total)
// 				}));
// 				return invs;
// 			} else {
// 				throw new Error("ERR: INV");
// 			}
// 		} catch (error) {
// 			throw new Error("ERR: INV");
// 		}
// 	}
// }



