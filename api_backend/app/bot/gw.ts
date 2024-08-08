import { Bot } from './factory'
import { IGrid } from '../model/grid'
import { ISiteInfo } from '../model/monit_model'
import { BrowserInstance } from '../browser'
import { gwParser } from '../utils/gwParser'
import { Page } from 'playwright'

const loginUrl 	= 'https://www.semsportal.com/home/login'
const apiUrl		= 'https://hk.semsportal.com/api/PowerStationMonitor/QueryPowerStationMonitor'
const apiParam	= 'QueryPowerStationMonitor'

const idtag 	= '#username'
const pwdtag	= '#password'
const etc			= '#readStatement'
const lgtag		= '#btnLogin'
const payload = { "powerstation_id": "", "key": "", "orderby": "", "powerstation_type": "", "powerstation_status": "", "page_size": 14,"page_index": 1, "adcode": "", "org_id": "", "condition": ""}
const paging  = 2



//TODO: 추후 페이징방법으로 전환해야함
export class GwBot implements Bot {

	private page: Page | null = null
	private grids: IGrid[] = []
	private id	= 'muan446600@naver.com'
	private pwd	= 'gw123456'


	async crawlling(): Promise<IGrid[]> {
		this.page = await BrowserInstance.getPage()
		await this.login()
		await this.scrapMonit()
		await this.page.close()
		return this.grids
	}


	//TODO: 추후 외부에서 받는 property => id, pwd, scode
	async initialize(info: ISiteInfo[]): Promise<void> {
	}


	async login(): Promise<void> {
		await this.page!.goto (loginUrl)
		await this.page!.fill (idtag, this.id)
		await this.page!.fill (pwdtag, this.pwd)
		await this.page!.click(etc)
		
		await this.page!.waitForTimeout(100)
		await this.page!.click(lgtag)

		await this.page!.waitForLoadState('networkidle');
	}


  async scrapMonit(): Promise<IGrid[]> {

    let grids: IGrid[] = []
		const token = await this.page!.evaluate(() => localStorage.getItem('TOKEN') )	//token 셋팅
		await this.registInterceptor(apiParam, this.grids)														// response 등록

		//TODO: getPagingNumber=>페이징의 넘버를 자동으로 받아오기
		for (let i = 1; i <= paging; i++) {
			await this.page!.evaluate(({token, apiUrl, i, payload}) => {
				
				const payload2 = { ...payload, page_index: i}
				
				fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Token': `${token}`
					},
					body: JSON.stringify(payload2)
				})
			}, {token, apiUrl, i, payload})

			await this.page!.waitForTimeout(2000)
		}
		return grids
  }


	async registInterceptor(param: string, grids: IGrid[]): Promise<void> {
		this.page!.on('response', async (res) => {
			
			console.log(await res.json())
			
			if (res.url().includes(param)) {
				try {
					const json = await res.json()
					const parsed = gwParser(json)
					console.log(json)
					
					grids.push( ...parsed )
				} catch (error) {
					console.error('파싱에러', error)
				}
			}
		})
	}
}



// TODO:TEST CODE
export const gwtest = async () => {
	const bot = new GwBot()
	console.log(await bot.crawlling())	
}