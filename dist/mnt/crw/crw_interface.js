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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsCrawler = void 0;
const axios_1 = __importDefault(require("axios"));
// BaseCrawler 추상 클래스 정의
class AbsCrawler {
    constructor(info) {
        this.ax = axios_1.default;
        this.isLogin = false;
        this.headers = {};
        this.login_payload = {};
        this.token = '';
        this.meta = info;
        this.baseurl = this.meta.url;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.login()
            const grid = yield this.getGrid();
            const vcb = yield this.getVcb();
            const inverter = yield this.getInverter();
            const pv = yield this.getPV();
            this.logout();
            return { grid, vcb, pv };
        });
    }
    login2(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(``, {
                username,
                password
            });
            // Assuming the token is returned in a field named "userKey" in the response data
            if (response.data && response.data.session && response.data.session.userKey) {
                this.token = response.data.session.userKey;
            }
        });
    }
    checkInstall(mcno, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error("Token not set!");
            }
            // const url = `${this.baseURL}check-install?mcno=${mcno}&uKey=${this.token}&time=${time}`;
            const response = yield axios_1.default.get('');
            return response.data;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.headers['Authorization'] = ``;
            }
            catch (error) {
                console.error("Craw Logout Fail", error);
            }
        });
    }
    getGrid() {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    getVcb() {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
}
exports.AbsCrawler = AbsCrawler;
