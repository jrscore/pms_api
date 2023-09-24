import { devLog } from "../../helper/helper";
import { OCTO_Crawler } from "../../crawller/machine/octo";
import { MetaModel } from "../../meta/meta_repository";
import { MonitRepository } from "../repository/monit_repository";
import { MetaService } from "../../meta/meta_service";
import { CrawllingService } from "../../crawller/crw_server";

export class MonitService {

	private repo: MonitRepository;
	constructor() {
		this.repo = new MonitRepository()
	}

	async fetchData() {
	}

	// 요청 파라미터에 따라 meta를 받아온다.
	// meta setting에 따라 크롤링 => 결과셋을 리턴한다.
	async getCurrent(alias: string) {
		try {
			const meta = await MetaService.getMetaByAlias(alias);
			if (!meta) return 
			const monit = CrawllingService.crawlingMonit('id')
		} catch (error) {
		}
	}

	// 요청 파라미터에 따라 meta를 받아온다.
	// meta setting에 따라 크롤링 => 결과셋을 리턴한다.
	async getDay(date: Date) { }

	async getMonth(year: number, month: number) { }


}
