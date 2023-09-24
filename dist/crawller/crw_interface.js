"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// BaseCrawler 추상 클래스 정의
// export abstract class ICrawller {
// 	protected ax = axios
// 	protected meta: IMeta	// corp, model, alias, id, pwd, url
// 	protected isLogin = false
// 	protected headers: { [key: string]: string } = {}
// 	protected baseurl: string
// 	protected payload = {}
// 	protected token = ''
// 	constructor(meta: IMeta) {
// 		this.meta = meta
// 		this.baseurl = this.meta.url
// 	}
// 	abstract fetch(): Promise<PV> 
// 	// {
// 	// 	if (await this.login(this.meta.id, this.meta.pwd)) {
// 	// 		return this.getPV()
// 	// 	} else {
// 	// 		throw new Error("로그인 실패")
// 	// 	}
// 	// }
// 	// async login(id: string, pwd: string): Promise<boolean> {
// 	// 	const response = await axios.post(``, {
// 	// 		username: id,
// 	// 		password: pwd
// 	// 	})
// 	// 	// Set UserKey 
// 	// 	if (response.data && response.data.session && response.data.session.userKey) {
// 	// 		this.token = response.data.session.userKey
// 	// 		this.isLogin = true
// 	// 	}
// 	// 	return this.isLogin
// 	// }
// 	abstract login(): Promise<boolean> 
// 	abstract logout(): Promise<void> 
// 	abstract getGrid(): Promise<Grid | null>
// 	abstract getVcb(): Promise<Vcb | null>
// 	abstract getPV(): Promise<PV>
// 	abstract getInverter(): Promise<[Inverter]>
// }
//# sourceMappingURL=crw_interface.js.map