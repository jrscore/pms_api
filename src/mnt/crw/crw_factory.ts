import { IMeta } from "../repository/mnt_meta_repository";
import { AbsCrawler } from "./crw_interface";
import { CM_Crawler } from "./instance/cm";
import { OCTO_Crawler } from "./instance/octo";


export class CrawlerFactory {

	private static crawlerTypes: { [key: string]: any } = {
		'CM': CM_Crawler,
		'OCTO': OCTO_Crawler,
		// 'DNE': DNE_Crawler,
		// 'DAS': DAS_Crawler,
		// 'HAN': HAN_Crawler,
		// 'REM': REM_Crawler,
		// 'LASI': LASI_Crawler,
		// 'WMS': WMS_Crawler,
	}

	public static async createCrawler(meta: IMeta): Promise<AbsCrawler> {
		if (!meta.model) {
			throw new Error(`CRWALER Model NOT Match: ${meta.model}`);
		}

		const crawlerClass = CrawlerFactory.crawlerTypes[meta.model];
		if (!crawlerClass) {
			throw new Error(`CRWALER Machine NOT INIT: ${meta.model}`);
		}
		return new crawlerClass()
	}
}