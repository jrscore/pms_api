import axios from "axios";
import { IMeta } from "../repository/mnt_meta_repository";
import { Grid, Inverter, Monit, PV, Vcb } from "../repository/mongoose_model";

// BaseCrawler 추상 클래스 정의
export abstract class AbsCrawler {

	protected ax = axios;
	protected meta: IMeta;	// corp, model, alias, id, pwd, url
	protected isLogin = false;

	protected headers: { [key: string]: string } = {}
	protected baseurl: string
	protected login_payload = {}
	protected token = ''


	constructor(info: IMeta) {
		this.meta = info;
		this.baseurl = this.meta.url;
	}


	async fetch(): Promise<Monit> {
		// await this.login()
		const grid = await this.getGrid();
		const vcb = await this.getVcb();
		const inverter = await this.getInverter();
		const pv = await this.getPV();
		this.logout()
		return { grid, vcb, pv }
	}


	async login2(username: string, password: string): Promise<void> {
		const response = await axios.post(``, {
			username,
			password
		});

		// Assuming the token is returned in a field named "userKey" in the response data
		if (response.data && response.data.session && response.data.session.userKey) {
			this.token = response.data.session.userKey;
		}
	}

	async checkInstall(mcno: string, time: string): Promise<any> {
		if (!this.token) {
			throw new Error("Token not set!");
		}

		// const url = `${this.baseURL}check-install?mcno=${mcno}&uKey=${this.token}&time=${time}`;
		const response = await axios.get('');
		return response.data;
	}



	async logout(): Promise<void> {
		try {
			this.headers['Authorization'] = ``;
		} catch (error) {
			console.error("Craw Logout Fail", error);
		}
	}

	async getGrid(): Promise<Grid | null> { return null }

	async getVcb(): Promise<Vcb | null> { return null }

	abstract getPV(): Promise<PV>;

	abstract getInverter(): Promise<[Inverter]>;
}

