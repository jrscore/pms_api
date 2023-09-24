"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawllingService = void 0;
const node_schedule_1 = require("node-schedule");
const octo_1 = require("./machine/octo");
const crw_factory_1 = require("./crw_factory");
const meta_service_1 = require("../meta/meta_service");
const aeon_monit_repository_1 = require("../mnt/repository/aeon_monit_repository");
const _monit_repository_1 = require("../mnt/repository/\bmonit_repository");
class CrawllingService {
    static aeonDeamon(cronTime, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name) {
                    const meta = yield meta_service_1.MetaService.getMetaByAlias(name);
                    if (!meta) {
                        console.error(`META fail => 'muan' & 'aeon'`);
                        return;
                    }
                    const crawler = new octo_1.OCTO_Crawler(meta);
                    (0, node_schedule_1.scheduleJob)(cronTime, () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const monit = yield crawler.fetch();
                            yield new aeon_monit_repository_1.AeonRepository().addlogs(monit);
                        }
                        catch (err) {
                            console.error("Error while fetching data or adding logs:", err);
                        }
                    }));
                }
                else {
                    // scheduleJob(cronTime, async () => {
                    const metas = yield meta_service_1.MetaService.getListByCorp('muan');
                    for (const key in metas) {
                        try {
                            if (metas.hasOwnProperty(key)) {
                                const meta = metas[key];
                                if (meta.model === 'DNE')
                                    continue;
                                const crawler = yield crw_factory_1.CrawlerFactory.createCrawler(meta);
                                const monit = yield crawler.fetch();
                                yield new _monit_repository_1.MonitRepository().save(monit);
                            }
                        }
                        catch (err) {
                            console.error("Error in processing meta:", err);
                        }
                    }
                }
                // })
            }
            catch (err) {
                console.error("Unexpected error in startDeamon:", err);
            }
        });
    }
    static dailyDeamon(cronTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metalist = yield meta_service_1.MetaService.getListByCorp('muan');
                for (const key in metalist) {
                    try {
                        if (metalist.hasOwnProperty(key)) {
                            const meta = metalist[key];
                            if (meta.model === 'OCTO')
                                continue;
                            if (meta.model === 'DNE')
                                continue;
                            const crawler = yield crw_factory_1.CrawlerFactory.createCrawler(meta);
                            const monit = yield crawler.fetch();
                            yield new _monit_repository_1.MonitRepository().save(monit);
                        }
                    }
                    catch (err) {
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
            }
            catch (err) {
                console.error("Unexpected error in startDeamon:", err);
            }
        });
    }
    static crawlingMonit(id, corp, model, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            // CrawllingMachine 생성
            // CrawllingMachine.fetch()
            return null;
        });
    }
}
exports.CrawllingService = CrawllingService;
//# sourceMappingURL=crw_server.js.map