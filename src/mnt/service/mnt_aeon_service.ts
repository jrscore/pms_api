import { devLog } from "../../helper/helper";
import { OCTO_Crawler } from "../crw/instance/octo";
import { AeonMonitRepository } from "../repository/mnt_aeon_repository";
import { IMeta, MetaModel } from "../repository/mnt_meta_repository";
import { scheduleJob } from "node-schedule";


export class AeonMonitService {

	private repo: AeonMonitRepository;
	private crawler?: OCTO_Crawler;
	private meta?: IMeta

	constructor(repo: AeonMonitRepository) {
		this.repo = repo;
		this.init();
	}
	
	async init() {
		const result = await MetaModel.findOne({ corp: 'muan', alias: 'aeon' });
		if (result) {
			this.meta = result;
			this.crawler = new OCTO_Crawler(this.meta);
			scheduleJob('*/3 7-20 * * *', () => this.crawlingData());
		} else {
			// 항목을 찾을 수 없을 때의 처리 로직 (예: 에러 로깅, 예외 발생 등)
    	}	
	}

	async crawlingData() {
		try {
			console.log("크롤링시작=>:", new Date());
			// #1. 몽구스에서 받아온 메타데이터를 토대로 크롤러 생성	
			if (this.meta || this.crawler) {
				const monit = await this.crawler!.fetch();
				await this.repo.addlogs(monit);
			} else {
				devLog("메타 데이터를 찾을 수 없습니다.");
			}
		} catch (error) {
			devLog('Main 에러 =>', error);
		}
	}

	async getCurrent() {
		try {
			return await this.repo.getCurrent();
		}
		catch (error) {
			devLog('aeon service -> repo에러', error);
		}
	}

	async getDay(date: Date) { }

	async getMonth(year: number, month: number) { }


}
