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
class AeonMonitService {
    constructor(repo) {
        this.repo = repo;
        // this.init();
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
//# sourceMappingURL=aeon_monit_service.js.map