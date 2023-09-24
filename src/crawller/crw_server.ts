import { Monit, PV } from '../mnt/repository/monit_model';
import { scheduleJob } from "node-schedule";
import { MetaModel } from "../meta/meta_repository";
import { OCTO_Crawler } from "./machine/octo";
import { CrawlerFactory } from "./crw_factory";
import { MetaService } from '../meta/meta_service';
import { AeonRepository } from '../mnt/repository/aeon_monit_repository';
import { MonitRepository } from '../mnt/repository/\bmonit_repository';

export class CrawllingService {

	static async aeonDeamon(cronTime: string, name?: string) {
		try {
			if (name) {
				const meta = await MetaService.getMetaByAlias(name);
				if (!meta) {
					console.error(`META fail => 'muan' & 'aeon'`)
					return
				}

				const crawler = new OCTO_Crawler(meta);
				scheduleJob(cronTime, async () => {
					try {
						const monit = await crawler.fetch();
						await new AeonRepository().addlogs(monit);
					} catch (err) {
						console.error("Error while fetching data or adding logs:", err);
					}
				})
			} else {
				// scheduleJob(cronTime, async () => {
				const metas: { [x: string]: any } = await MetaService.getListByCorp('muan');

				for (const key in metas) {
					try {
						if (metas.hasOwnProperty(key)) {
							const meta = metas[key]
							if (meta.model === 'DNE') continue
							const crawler = await CrawlerFactory.createCrawler(meta);
							const monit = await crawler.fetch();
							await new MonitRepository().save(monit);
						}
					} catch (err) {
						console.error("Error in processing meta:", err);
					}
				}
			}
			// })
		} catch (err) {
			console.error("Unexpected error in startDeamon:", err);
		}
	}


	static async dailyDeamon(cronTime: string) {
		try {
			const metalist: { [x: string]: any } = await MetaService.getListByCorp('muan');
			for (const key in metalist) {
				try {
					if (metalist.hasOwnProperty(key)) {
						const meta = metalist[key]
						if (meta.model === 'OCTO') continue
						if (meta.model === 'DNE') continue
						const crawler = await CrawlerFactory.createCrawler(meta);
						const monit = await crawler.fetch();
						await new MonitRepository().save(monit);
					}
				} catch (err) {
					console.error("Error in processing meta:", err);
				}
			}

			// if (name) {
			// 	if (!meta) {
			// 		console.error(`META fail => 'muan' & 'aeon'`)
			// 		return
			// 	}

			// 	const crawler = new OCTO_Crawler(meta);
			// 	scheduleJob(cronTime, async () => {
			// 		try {
			// 			const monit = await crawler.fetch();
			// 			await new AeonRepository().addlogs(monit);
			// 		} catch (err) {
			// 			console.error("Error while fetching data or adding logs:", err);
			// 		}
			// 	})
			// } else {
			// 	// scheduleJob(cronTime, async () => {
			// 		const metas: { [x: string]: any } = await MetaService.getMetaByCorp('muan');

			// 		for (const key in metas) {
			// 			try {
			// 				if (metas.hasOwnProperty(key)) {
			// 					const meta = metas[key]
			// 					if (meta.model === 'DNE') continue
			// 					const crawler = await CrawlerFactory.createCrawler(meta);
			// 					const monit = await crawler.fetch();
			// 					await new MonitRepository().save(monit);
			// 				}
			// 			} catch (err) {
			// 				console.error("Error in processing meta:", err);
			// 			}
			// 		}
			// 	}
			// })
		} catch (err) {
			console.error("Unexpected error in startDeamon:", err);
		}
	}


	static async crawlingMonit(id?: string, corp?: string, model?: string, alias?: string): Promise<Monit | null> {
		// CrawllingMachine 생성
		// CrawllingMachine.fetch()
		return null;
	}

}