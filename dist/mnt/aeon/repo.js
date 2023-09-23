"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
class RepoService {
    async getCurrent() {
        try {
            const json = await model_1.aeonusModel.findOne().sort({ _id: -1 }).exec();
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
    }
    // 일자를 인수로 받아서 해당일자의 맨 마지막 데이터를 받아온다
    async getDay(date) {
        try {
            // 해당 일자 시작과 끝을 설정
            const start = new Date(date).setHours(0, 0, 0, 0);
            const end = new Date(date).setHours(23, 59, 59, 999);
            const json = await model_1.aeonusModel.findOne({
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
    }
    // 월을 인수로 받아서 해당월의 매일의 맨 마지막 데이터를 받아온다
    async getMonth(year, month) {
        try {
            const mth_stt = new Date(year, month, 1);
            const mth_end = new Date(year, month + 1, 0, 23, 59, 59, 999);
            const results = [];
            for (let day = mth_stt; day <= mth_end; day.setDate(day.getDate() + 1)) {
                const data = await this.getDay(day);
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
    }
}
exports.default = new RepoService();
