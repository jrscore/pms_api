import axios, { AxiosInstance } from 'axios';
import { devLog, generateTimeBasedOnNow, intParser, wait } from '../../helper/helper';
import { Meta } from '../../meta/meta_repository';
import { Grid, Inverter, Monit, PV, Vcb } from '../../mnt/repository/monit_model';


export class OCTO_Crawler {

	private url: string
	private id: string
	private pwd: string
	private headers: { [key: string]: string } = {}
	private sitecode = 6792
	private _token = ''
	private ax = axios.create()
	get isLogin(): boolean {
		return !!this._token;
	}

	constructor(meta: Meta) {
		console.log("OCTO_Crawler 생성")
		this.url = meta.url
		this.id = meta.id
		this.pwd = meta.pwd
		this.headers = {
			'Accept': `application/json, text/plain, */*`,
			'Content-Type': 'text/plain',
			'Origin': 'https://www.octo.co.kr',
			'Referer': 'https://www.octo.co.kr/',
		}
	}

	async fetch(): Promise<Monit> {
		try {
			if (!this.isLogin) {
				await this.login()
			}
			await wait(3000)
			const grid = await this.getGrid();
			await wait(3000)
			const vcb = await this.getVcb();
			await wait(3000)
			const pv = await this.getPV();
			await wait(3000)
			return { grid, vcb, pv }

		} catch (error) {
			throw new Error("FETCH 실패");
		}
	}

	async getGrid(): Promise<Grid | null> {
		return null
	}

	async login(): Promise<boolean> {
		try {
			devLog("로그인시도");
			const payload = {
				userId: this.id,
				userPass: this.pwd,
				referrer: 'ems_customer_pc_web'
			}

			const response = await this.ax.post(`${this.url}/authority/login`, payload, { headers: this.headers });
			const json = response.data;
			if (json.response?.session?.userKey) {	// => optional chaining
				this._token = json.response?.session?.userKey
			}
			return true;
		} catch (error) {
			console.error("로그인실패", error);
			return false
		}
	}



	async getVcb(): Promise<Vcb> {
		try {
			const apiUrl = `${this.url}/meter/data`;
			const payload = {
				mcno: this.sitecode,
				uKey: this._token,
				time: generateTimeBasedOnNow()// time: 4156239939
			};

			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

			if (response.status === 200 && response.data?.response?.meter) {
				const json = response.data.response.meter[0]
				return {
					time: new Date(json.updatedAt),
					acb_yld: json.meters[0].activeKwh,
					vcb_yld: json.meters[2].activeKwh
				}
			} else {
				throw new Error("ERR: VCB");
			}
		} catch (error) {
			throw new Error("ERR: VCB");
		}
	}

	async getPV(): Promise<PV> {
		try {
			const apiUrl = `${this.url}/inverter/daytotal`;
			const payload = {
				mcno: this.sitecode,
				uKey: this._token,
				time: generateTimeBasedOnNow()
			};

			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

			if (response.status === 200 && response.data?.response) {
				const json = response.data?.response
				return {
					date: new Date(),
					pwr: intParser(json.ackw),
					day: intParser(json.dayTotal),
					mth: 0,
					yld: intParser(json.total),
					invs: await this.getInverter()
				}
			} else {
				throw new Error("ERR: INV");
			}
		} catch (error) {
			throw new Error("ERR: INV");
		}
	}

	async getInverter(): Promise<Inverter[]> {
		try {
			const apiUrl = `${this.url}/inverter/data`;
			const payload = {
				mcno: this.sitecode,
				uKey: this._token,
				time: generateTimeBasedOnNow()
			};

			const response = await this.ax.get(apiUrl, { headers: this.headers, params: payload });

			if (response.status === 200 && response.data?.response?.inverters[0]?.inverters) {
				const json = response.data?.response?.inverters[0]?.inverters

				let invs: Inverter[] = json.map((inv: any, idx: number) => ({
					no: idx + 1,
					stt: inv.isRun,
					dcv: intParser(inv.dcv),
					dca: intParser(inv.dca),
					pwr: intParser(inv.ackw),
					day: intParser(inv.dayTotal),
					yld: intParser(inv.total)
				}));
				return invs;
			} else {
				throw new Error("ERR: INV");
			}
		} catch (error) {
			throw new Error("ERR: INV");
		}
	}
}



