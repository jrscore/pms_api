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
exports.CrawlerFactory = void 0;
const cm_1 = require("./instance/cm");
const octo_1 = require("./instance/octo");
class CrawlerFactory {
    static createCrawler(meta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!meta.model) {
                throw new Error(`CRWALER Model NOT Match: ${meta.model}`);
            }
            const crawlerClass = CrawlerFactory.crawlerTypes[meta.model];
            if (!crawlerClass) {
                throw new Error(`CRWALER Machine NOT INIT: ${meta.model}`);
            }
            return new crawlerClass();
        });
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
