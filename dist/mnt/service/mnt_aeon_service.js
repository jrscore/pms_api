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
exports.AeonMonitService = void 0;
const helper_1 = require("../../helper/helper");
const octo_1 = require("../crw/instance/octo");
const mnt_meta_repository_1 = require("../repository/mnt_meta_repository");
const node_schedule_1 = require("node-schedule");
class AeonMonitService {
    constructor(repo) {
        this.repo = repo;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mnt_meta_repository_1.MetaModel.findOne({ corp: 'muan', alias: 'aeon' });
            if (result) {
                this.meta = result;
                this.crawler = new octo_1.OCTO_Crawler(this.meta);
                (0, node_schedule_1.scheduleJob)('*/3 7-20 * * *', () => this.crawlingData());
            }
            else {
                // 항목을 찾을 수 없을 때의 처리 로직 (예: 에러 로깅, 예외 발생 등)
            }
        });
    }
    crawlingData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Initialization started at:", new Date());
                // #1. 몽구스에서 받아온 메타데이터를 토대로 크롤러 생성	
                if (this.meta || this.crawler) {
                    const monit = yield this.crawler.fetch();
                    yield this.repo.addlogs(monit);
                }
                else {
                    (0, helper_1.devLog)("메타 데이터를 찾을 수 없습니다.");
                }
            }
            catch (error) {
                (0, helper_1.devLog)('Main 에러 =>', error);
            }
        });
    }
    getCurrent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.getCurrent();
            }
            catch (error) {
                (0, helper_1.devLog)('aeon service -> repo에러', error);
            }
        });
    }
    getDay(date) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.AeonMonitService = AeonMonitService;
