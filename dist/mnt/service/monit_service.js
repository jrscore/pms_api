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
exports.MonitService = void 0;
const _monit_repository_1 = require("../repository/\bmonit_repository");
const meta_service_1 = require("../../meta/meta_service");
const crw_server_1 = require("../../crawller/crw_server");
class MonitService {
    constructor() {
        this.repo = new _monit_repository_1.MonitRepository();
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // 요청 파라미터에 따라 meta를 받아온다.
    // meta setting에 따라 크롤링 => 결과셋을 리턴한다.
    getCurrent(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const meta = yield meta_service_1.MetaService.getMetaByAlias(alias);
                if (!meta)
                    return;
                const monit = crw_server_1.CrawllingService.crawlingMonit('id');
            }
            catch (error) {
            }
        });
    }
    // 요청 파라미터에 따라 meta를 받아온다.
    // meta setting에 따라 크롤링 => 결과셋을 리턴한다.
    getDay(date) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.MonitService = MonitService;
//# sourceMappingURL=monit_service.js.map