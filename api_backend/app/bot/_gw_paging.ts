// import { IGrid } from '../model/grid'
// import { Page } from 'playwright'
// import { Bot } from './factory'
// import { ISiteInfo } from '../model/monit_model'
// import { BrowserInstance } from '../browser'
// import { gwParser } from '../utils/gwParser'

// const loginUrl = 'https://www.semsportal.com/home/login'
// const apiUrl	= 'QueryPowerStationMonitor'

// const idtag 	= '#username'
// const pwdtag	= '#password'
// const etc			= '#readStatement'
// const lgtag		= '#btnLogin'

// const id			= 'muan446600@naver.com'
// const pwd			= 'gw123456'


// export class GwPagingBot implements Bot {

// 	private page: Page | null = null
// 	private grids: IGrid[] = []

// 	async crawlling(): Promise<IGrid[]> {
// 		this.page = await BrowserInstance.getPage()
// 		await this.login()
// 		await this.scrapMonit()
// 		await this.page.close()
// 		return this.grids
// 	}


// 	//TODO:외부에서 받는 property => id, pwd, scode
// 	async initialize(info: ISiteInfo[]): Promise<void> {
// 	}


// 	async login(): Promise<void> {
// 		await this.page!.goto (loginUrl)
// 		await this.page!.fill (idtag, id)
// 		await this.page!.fill (pwdtag, pwd)
// 		await this.page!.click(etc)
		
// 		await this.page!.waitForTimeout(1000)
// 		await this.page!.click(lgtag)
// 	}


// 	// 크롤링 
// 	async scrapMonit(): Promise<void> {


// 		// response 등록
// 		// await this.registInterceptor(apiUrl, this.grids)

// 		// 페이징
// 		let		ispaging = true
// 		const nextLink = await this.page!.$('text=다음')
// 		while (ispaging) {
// 			this.page!.waitForLoadState('networkidle') //로딩완료 대기
// 			if (nextLink) {
// 				const isclass = await nextLink.getAttribute('class')
// 				const endpage = isclass?.includes('disabled')
// 				console.log('계속',  endpage)

// 				if( !endpage ){
// 					console.log('페이징시작')
// 					nextLink.click()
// 				} else {
// 					console.log('페이징끝')
// 					ispaging = false
// 				}
// 			} else {
// 				console.log('다음버튼 실패')
// 			}
// 		}
// 	}


// 	async registInterceptor(param: string, grids: IGrid[]): Promise<void> {
// 		this.page!.on('response', async (res) => {
// 			if (res.url().includes(param)) {
// 				try {
// 					const json = await res.json()
// 					const parsed = gwParser(json)
// 					grids.push( ...parsed )
// 				} catch (error) {
// 					console.error('파싱에러', error)
// 				}
// 			}
// 		})
// 	}

// }



