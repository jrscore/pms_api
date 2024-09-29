import { Bot } from './factory'
import { GridData } from '../model/grid'
import { MonitModel, SiteInfo } from '../model/monit_model'
import { BrowserInstance } from '../browser'
import { hexXmlParser } from '../utils/hexParser'
import axios, { AxiosInstance } from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { getMonitModel } from '../firebase/r_mnt_model'
import { getSiteList } from '../firebase/r_site_info'
import { CookieJar } from 'tough-cookie'
import * as cheerio from 'cheerio'


const header = {
	'Origin':					'https://weblink.hex.co.kr',
	'Referer':				'https://weblink.hex.co.kr/kor/Customer/default.aspx',
	'Connection':			'keep-alive',
	'Content-Type':		'application/x-www-form-urlencoded; charset=UTF-8',
	'Accept':					'text/html,application/xhtml+xml,application/xml;q=0.9,,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	'User-Agent': 		'Chrome/126.0.0.0 Safari/537.36',
	'X-Requested-With': 'XMLHttpRequest',
	'sec-ch-ua': "Google Chrome;v=129, Not=A?Brand;v=8, Chromium;v=129",
	'sec-ch-ua-mobile':'?0',
	'sec-ch-ua-platform':"macOS",
	'sec-fetch-dest':'empty',
	'sec-fetch-mode':'cors',
	'sec-fetch-site':'same-origin',
}



export class HexBot implements Bot {

	private baseUrl		= 'https://weblink.hex.co.kr'
	private loginUrl	= '/kor/Customer/default.aspx'
	private apiUrl 		= '/kor/webservice/real.asmx/RealData21'

	private model: MonitModel = {} as MonitModel
	private sites: SiteInfo[] = []
	private Axios!: AxiosInstance
		

	async initialize(cid:string) {
		this.model = await getMonitModel('hex') ?? this.model
		this.sites = await getSiteList(cid, 'hex')
		
		this.Axios = wrapper(axios.create({
			baseURL: this.baseUrl,
			withCredentials: true,
			jar: new CookieJar()
		}))
	}


	async crawlling(): Promise<GridData[]> {
		await this.login(this.sites[0].id, this.sites[0].pwd)
		const gridList: GridData[] = []
		for (const site of this.sites) {
			gridList.push( await this.fetchGrid(site) )
			await new Promise<void>(s => setTimeout(s, 1000))
		}
		return gridList
	}


	async login(id:string, pwd:string): Promise<void> {

		const payload = { builderNo:732 }
		try {
			const payload = {ctl00$main$txt_ID: id, ctl00$main$txt_PW: pwd, 'ctl00$main$btn_Login.x': 57, 'ctl00$main$btn_Login.y': 49 }
			await this.Axios.post(this.loginUrl, payload, { headers: header })
			await new Promise<void>(s => setTimeout(s, 1000))
		} catch (error) {
			console.error('HEX LOGIN 실패:', error)
		}
	}

	async fetchGrid(site:SiteInfo): Promise<GridData> {
		const headers = {
			'Accept': 					'application/xml, text/xml, */*; q=0.01',
			'Referer': 					'https://weblink.hex.co.kr/kor/Pages/Monitoring.aspx?p=m',
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 		'application/x-www-form-urlencoded; charset=UTF-8',
			'User-Agent':				'Chrome/126.0.0.0 Safari/537.36',
		}
		try {
			const payload = {_cbid: site.code}
			const response = await this.Axios.post( `${this.apiUrl}`, payload, {headers:headers})
      const $ = cheerio.load(response.data, { xmlMode: true })

      // <tdata> 태그에서 JSON 문자열을 가져옴
      const tdataValue = $('tdata').attr('value')
      if (!tdataValue) {
        throw new Error('tdata 값이 없습니다.')
      }

      // tdata 속성의 값은 JSON 문자열이므로 이를 파싱
      const invertersArray = JSON.parse(tdataValue);

      const inverters = invertersArray.map((inv: any, idx: number) => ({
        no: idx + 1,
        run: this.runState(inv.Badge),
        pwr: parseFloat(inv.s_power),
        day: 0,
        yld: 0,
      }));

      // 디버깅용 로그
      console.log(inverters)
			return {
				alias:	site.alias,
				pwr:		inverters.reduce((sum, inv) => sum + inv.pwr, 0),
				day:		inverters.reduce((sum, inv) => sum + inv.day, 0),
				invs:		inverters,
			}
		} catch (err) {
			console.error('HEX Inverter 에러 발생:', err)
			return { alias: site.alias, pwr:0, day:0, invs:[] }
		}
	}

  // async login(): Promise<void> {
  //   await this.page!.goto (loginUrl)
  //   await this.page!.fill (idtag, id)
  //   await this.page!.fill (pwdtag, pwd)
  //   await this.page!.click(logtag)
  // }

	// async fetchGrid(): Promise<GridData[]> {
		
	// 	let gridList: GridData[] = []

	// 	try {
	// 		// API 응답 대기
	// 		const promise = this.page!.waitForResponse(response => response.url().includes(apiUrl))
	// 		await this.page!.goto(apiPage)
	// 		const response = await promise

	// 		// 응답 바디를 텍스트로 변환 후 파싱
	// 		const responseBody = await response.text()
	// 		gridList = hexXmlParser(responseBody)

	// 	} catch (error) {
	// 		console.error('Error fetching grid:', error)
	// 	}

	// 	return gridList
	// }
	  // Badge 값에 따른 run 상태 반환 (예: "정지중"이면 false)
  private runState(badge: string): boolean {
    return badge.includes('정지중') ? false : true;
  }
}

