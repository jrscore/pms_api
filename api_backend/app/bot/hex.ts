import { chromium, Page, Browser } from 'playwright'
import { Bot } from './factory'
import { IGrid, IInverter } from '../model/grid'
import { ISiteInfo } from '../model/monit_model'
import { BrowserInstance } from '../browser'
import { hexXmlParser } from '../utils/hexParser'

const loginUrl = 'https://weblink.hex.co.kr/kor/Customer/default.aspx'
const apiPage = 'https://weblink.hex.co.kr/kor/pages/dashboard_simple.aspx'
const apiUrl = 'observe.asmx'

const idtag = '#ctl00_main_txt_ID'
const pwdtag = '#ctl00_main_txt_PW'
const logtag = '#ctl00_main_btn_Login'

const id	= 'dong7101'
const pwd = '9999'

const payload = { builderNo:732 }

export class HexBot implements Bot {
  
	private page: Page | null = null

  async crawlling(): Promise<IGrid[]> {
		this.page = await BrowserInstance.getPage()
		await this.login()
		const grids = await this.fetchGrid()
		await this.page.close()
		console.log(grids);
		
		return grids
  }

  async initialize(): Promise<void> {
    // this.page = await BrowserManager.newPage()
  }

  async login(): Promise<void> {
    await this.page!.goto (loginUrl)
    await this.page!.fill (idtag, id)
    await this.page!.fill (pwdtag, pwd)
    await this.page!.click(logtag)
  }

	async fetchGrid(): Promise<IGrid[]> {
		
		let gridList: IGrid[] = []

		try {
			// API 응답 대기
			const promise = this.page!.waitForResponse(response => response.url().includes(apiUrl))
			await this.page!.goto(apiPage)
			const response = await promise

			// 응답 바디를 텍스트로 변환 후 파싱
			const responseBody = await response.text()
			gridList = hexXmlParser(responseBody)

		} catch (error) {
			console.error('Error fetching grid:', error)
		}

		return gridList
	}
}