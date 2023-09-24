import { Meta } from "../meta/meta_repository";
import { ICrawller } from "./crw_interface";
import { CM_Crawler } from "./machine/cm";
import { OCTO_Crawler } from "./machine/octo";


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

	public static createCrawler(meta: Meta): Promise<ICrawller> {
		if (!meta.model) {
			throw new Error(`CRWALER Model NOT Match: ${meta.model}`);
		}

		const crawlerAdapter = CrawlerFactory.crawlerTypes[meta.model];
		if (!crawlerAdapter) {
			throw new Error(`CRWALER Machine NOT INIT: ${meta.model}`);
		}
		return new crawlerAdapter(meta)
	}
}