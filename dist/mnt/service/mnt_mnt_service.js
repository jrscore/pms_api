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
const helper_1 = require("../../helper/helper");
const octo_1 = require("../crw/instance/octo");
const mnt_meta_repository_1 = require("../repository/mnt_meta_repository");
const mnt_mnt_repository_1 = require("../repository/mnt_mnt_repository");
class MonitService {
    constructor() {
        this.repo = new mnt_mnt_repository_1.MonitRepository();
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getCurrent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // #1. 몽구스에서 받아온 메타데이터를 토대로 크롤러 생성
                const meta = yield mnt_meta_repository_1.MetaModel.findOne({ corp: 'muan', alias: 'aeon' });
                if (meta) {
                    // devLog('받아온 메타데이터===>',meta)
                    const crwler = new octo_1.OCTO_Crawler(meta);
                    const monit = yield crwler.fetch();
                    // 몽구스db에 저장 후 리턴
                    return yield this.repo.addlogs(monit);
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
    getDay(date) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.MonitService = MonitService;
