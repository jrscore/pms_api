import { devLog } from "../../helper/helper";
import { OCTO_Crawler } from "../crw/instance/octo";
import { MetaModel } from "../repository/mnt_meta_repository";
import { MonitRepository } from "../repository/mnt_mnt_repository";

export class MonitService {

	private repo: MonitRepository;
	constructor() {
		this.repo = new MonitRepository()
	}

	async fetchData() {
	}

	async getCurrent() {
		try {
			// #1. 몽구스에서 받아온 메타데이터를 토대로 크롤러 생성
			const meta = await MetaModel.findOne({ corp: 'muan', alias: 'aeon' });

			if (meta) {
				// devLog('받아온 메타데이터===>',meta)
				const crwler = new OCTO_Crawler(meta);
				const monit = await crwler.fetch();

				// 몽구스db에 저장 후 리턴
				return await this.repo.addlogs(monit);
			} else {
				devLog("메타 데이터를 찾을 수 없습니다.");
			}
		} catch (error) {
			devLog('Main 에러 =>', error);
		}

	}

	async getDay(date: Date) { }

	async getMonth(year: number, month: number) { }


}
