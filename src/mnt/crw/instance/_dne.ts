import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { devLog, generateTimeBasedOnNow, intParser, wait } from '../../../helper/helper';
import { IMeta } from '../../repository/mnt_meta_repository';
import { Grid, Inverter, Monit, PV, Vcb } from '../../repository/mongoose_model';



export class DNE_Crawler {
	private url: string
	private id: string
	private pwd: string
	private headers: { [key: string]: string } = {}
	private sitecode = ''
	private _token = ''
	private cookie: string | null = null;
	private ax: AxiosInstance;
	get isLogin(): boolean {
		return !!this._token;
	}

	constructor(meta: IMeta) {
		this.url = meta.url
		this.id = meta.id
		this.pwd = meta.pwd
		this.ax = axios.create({ baseURL: this.url, withCredentials: true });
		const headers = {
			// 'Accept': 'application/json, text/javascript, */*; q=0.01',
			// 'Accept-Encoding': 'gzip, deflate',
			// 'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			// 'Connection': 'keep-alive',
			// 'Host': 'www.cmsolar.kr',
			// 'Referer': 'http://www.cmsolar.kr',
			// 'X-Requested-With': 'XMLHttpRequest',
			// 'Content-Type': 'application/x-www-form-urlencoded',
			// 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36', // 변경된 User-Agent
		};
	}

	async fetch(): Promise<Monit> {
		try {
			await this.login()
			if (!this.isLogin) throw new Error("Token not set!");

			await wait(3000)
			const grid = await this.getGrid();
			await wait(3000)
			const vcb = await this.VCB();
			await wait(3000)
			const pv = await this.getPV();
			await wait(3000)
			this.logout()
			return { pv, vcb, grid }
		} catch (error) {
			throw new Error("FETCH 실패");
		}
	}

	async logout(): Promise<void> {
		devLog("로그아웃")
		this._token = ''
	}

	async login(): Promise<void> {
		try {
			devLog('로그인시도')
			// 2. URLSearchParams 객체를 사용하여 데이터 변환
			const formData = new URLSearchParams();
			formData.append('__VIEWSTATE', '/wEPDwUKMTEwNjU2MzEzMmRkEPloW22nm+2u6V40LxFcfO1zqxM=');
			formData.append('__VIEWSTATEGENERATOR', '29B1BD26');
			formData.append('__EVENTVALIDATION', '/wEWAwKE6f/4BAK3g9/5BgK6g9/5BpAPO6WNZml2xC9MhP0kjulQ1fI4');
			formData.append('Txt_1', this.id);
			formData.append('Txt_2', this.pwd);

			const response = await this.ax.post('https://www.qs2200.co.kr/SrMain/SM010.aspx', formData);
			devLog(response.data)
			const redirectMatch = response.data.match(/location\.replace\(["']?(.+?)["']?\)/);
			if (redirectMatch && redirectMatch[1]) {
				const redirectURL = redirectMatch[1]
				devLog(redirectURL);

				// 리다이렉트되는 페이지로 요청
				const redirectResponse = await this.ax.get(redirectURL);
				devLog(redirectResponse.data);
				//   if(response.status === 200 && response.data.includes('location.replace')) {
				// 		const redirectMatch = response.data.match(/location\.replace\(["']?(.+?)["']?\)/);
				// 		if (redirectMatch && redirectMatch[1]) {
				// 			 const redirectURL = redirectMatch[1];
				// 			 console.log(`Should redirect to: ${redirectURL}`);
				// 			 // 여기서 필요한 처리를 수행합니다.
				// 		}
				//   }
				//   } else {
				//       console.error('Login failed with status:', response.status);
			}
			return response.data;
		} catch (error) {
			console.error("로그인실패", error);
		}
	}


	async getPV(): Promise<PV> {
		if (!this._token) {
			throw new Error('Session cookie 실패');
		}
		try {
			const headers = {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				'Connection': 'keep-alive',
				'Host': 'www.cmsolar.kr',
				'Referer': 'http://www.cmsolar.kr/plant/',
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': this._token
			};

			devLog(headers)
			const apiUrl = `./plant/sub/idx_ok.php?mode=getPlant`;
			const response = await this.ax.get(apiUrl, { headers: { 'Cookie': this._token } })
			devLog(response.data)
			if (response.status === 200 && response.data?.[0]) {
				const json = response.data?.[0]
				return {
					date: new Date(),
					pwr: intParser(json.plant.now),
					day: intParser(json.plant.today),
					mth: intParser(json.plant.thismonth),
					yld: intParser(json.plant.total),
					invs: await this.getInverter(json.power)
				}
			} else {
				throw new Error("ERR: INV");
			}
		} catch (error) {
			throw new Error("ERR: INV");
		}
	}

	async getInverter(json: any): Promise<Inverter[]> {
		devLog(json)
		try {
			let invs: Inverter[] = json.map((inv: any, idx: number) => ({
				no: idx + 1,
				stt: true,
				dcv: intParser(inv.pow_dcv),
				dca: intParser(inv.pow_dca),
				pwr: intParser(inv.pow_dcp),
				day: intParser(inv.pow_today),
				mth: intParser(inv.pow_thismonth),
				yld: intParser(inv.pow_totalpower),
			}))
			return invs
		} catch (error) {
			throw new Error("ERR: INV");
		}
	}


	async getGrid(): Promise<Grid | null> {
		return null
	}

	async VCB(): Promise<Vcb| null> {
		return null
	}
}



