import { devLog } from "../../helper/helper";
import { OCTO_Crawler } from "../../crawller/machine/octo";
import { AeonRepository } from "../repository/aeon_monit_repository";
import { Meta, MetaModel } from "../../meta/meta_repository";


export class AeonMonitService {

	private repo: AeonRepository;
	private crawler?: OCTO_Crawler;
	private meta?: Meta

	constructor(repo: AeonRepository) {
		this.repo = repo;
		// this.init();
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
