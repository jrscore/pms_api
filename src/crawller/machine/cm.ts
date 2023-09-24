import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { devLog, intParser, wait } from '../../helper/helper';
import { Meta } from '../../meta/meta_repository';
import { Monit, PV, Inverter, Grid, Vcb } from '../../mnt/repository/monit_model';
import { ICrawller } from '../crw_interface';



export class CM_Crawler implements ICrawller {
	ax: AxiosInstance
	url: string
	id: string
	pwd: string
	headers: { [key: string]: string } = {}
	payload: { [key: string]: string } = {}
	_token = ''
	sitecode = ''
	cookie: string | null = null;

	constructor(meta: Meta) {
		console.log('cm crawler 생성')
		this.id = meta.id
		this.pwd = meta.pwd
		this.url = meta.url
		this.ax = axios.create({ baseURL: this.url, withCredentials: true });
	}

	get isLogin(): boolean {
		return !!this._token;
	}


	async fetch(): Promise<Monit> {
		try {
			await this.login()
			await wait(1000)
			const pv = await this.getPV();
			await wait(1000)
			this.logout()
			return { pv, grid: null, vcb: null }
		} catch (error) {
			throw new Error("FETCH 실패");
		}
	}

	async logout(): Promise<void> {
		devLog("로그아웃")
		this._token = ''
	}

	async login(): Promise<boolean> {
		const headers = {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			'Connection': 'keep-alive',
			'Host': 'www.cmsolar.kr',
			'Referer': 'http://www.cmsolar.kr',
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36', // 변경된 User-Agent
		};

		try {
			const payload = { id: this.id, password: this.pwd, }

			// 2. URLSearchParams 객체를 사용하여 데이터 변환
			const formData = new URLSearchParams()
			formData.append('id', this.id)
			formData.append('pw', this.pwd)

			const response = await this.ax.post('./login_ok.php', formData, { headers: headers })
			devLog(response.data)
			const cookie = response.headers['set-cookie']?.[0]?.split(';')[0];
			if (cookie) {
				this._token = cookie;
				devLog(`토큰: ${this._token}`)
			}
			return this.isLogin
		} catch (error) {
			console.error("CM 로그인실패");
			return false
		}
	}


	async getPV(): Promise<PV> {
		if (!this.isLogin) {
			throw new Error('CM: 토큰이 없습니다.');
		}
		try {
			const headers = {
				'Host': 'www.cmsolar.kr',
				'Referer': 'http://www.cmsolar.kr/plant/',
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': this._token
			};
			devLog(headers)

			const apiUrl = `./plant/sub/idx_ok.php?mode=getPlant`;
			const response = await this.ax.get(apiUrl, { headers: { 'Cookie': this._token } })
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
	}
}



