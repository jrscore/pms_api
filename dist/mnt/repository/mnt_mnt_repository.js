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
exports.MonitRepository = void 0;
const mongoose_model_1 = require("./mongoose_model");
class MonitRepository {
    // 현재 데이터를 받아서 저장한다
    addlogs(monit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newdoc = yield mongoose_model_1.monitModel.create(monit);
            }
            catch (error) {
                throw new Error('Server Error');
            }
        });
    }
    // 최신 데이터를 받아온다
    getCurrent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = yield mongoose_model_1.monitModel.findOne().sort({ _id: -1 }).exec();
                if (json) {
                    return json;
                }
                else {
                    throw new Error('REPO: Document not found');
                }
            }
            catch (error) {
                throw new Error('REPO: Server Error');
            }
        });
    }
    // 일자를 인수로 받아서 해당일자의 맨 마지막 데이터를 받아온다
    getDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 해당 일자 시작과 끝을 설정
                const start = new Date(date).setHours(0, 0, 0, 0);
                const end = new Date(date).setHours(23, 59, 59, 999);
                const json = yield mongoose_model_1.monitModel.findOne({
                    date: {
                        $gte: start,
                        $lte: end
                    }
                }).sort({ _id: -1 }).exec();
                if (json) {
                    return json;
                }
                else {
                    throw new Error('Document not found');
                }
            }
            catch (error) {
                throw new Error('Server Error');
            }
        });
    }
    // 월을 인수로 받아서 해당월의 매일의 맨 마지막 데이터를 받아온다
    getMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mth_stt = new Date(year, month, 1);
                const mth_end = new Date(year, month + 1, 0, 23, 59, 59, 999);
                const results = [];
                for (let day = mth_stt; day <= mth_end; day.setDate(day.getDate() + 1)) {
                    const data = yield this.getDay(day);
                    if (data) {
                        results.push(data);
                    }
                }
                if (results.length > 0) {
                    return results;
                }
                else {
                    throw new Error('Documents not found for the given month');
                }
            }
            catch (error) {
                throw new Error('Server Error');
            }
        });
    }
}
exports.MonitRepository = MonitRepository;
