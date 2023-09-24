"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerFactory = void 0;
const cm_1 = require("./machine/cm");
const octo_1 = require("./machine/octo");
class CrawlerFactory {
    static createCrawler(meta) {
        if (!meta.model) {
            throw new Error(`CRWALER Model NOT Match: ${meta.model}`);
        }
        const crawlerAdapter = CrawlerFactory.crawlerTypes[meta.model];
        if (!crawlerAdapter) {
            throw new Error(`CRWALER Machine NOT INIT: ${meta.model}`);
        }
        return new crawlerAdapter(meta);
    }
}
exports.CrawlerFactory = CrawlerFactory;
CrawlerFactory.crawlerTypes = {
    'CM': cm_1.CM_Crawler,
    'OCTO': octo_1.OCTO_Crawler,
    // 'DNE': DNE_Crawler,
    // 'DAS': DAS_Crawler,
    // 'HAN': HAN_Crawler,
    // 'REM': REM_Crawler,
    // 'LASI': LASI_Crawler,
    // 'WMS': WMS_Crawler,
};
//# sourceMappingURL=crw_factory.js.map