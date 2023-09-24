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
exports.CM_Crawler = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../../helper/helper");
class CM_Crawler {
    constructor(meta) {
        this.headers = {};
        this.payload = {};
        this._token = '';
        this.sitecode = '';
        this.cookie = null;
        console.log('cm crawler 생성');
        this.id = meta.id;
        this.pwd = meta.pwd;
        this.url = meta.url;
        this.ax = axios_1.default.create({ baseURL: this.url, withCredentials: true });
    }
    get isLogin() {
        return !!this._token;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.login();
                yield (0, helper_1.wait)(1000);
                const pv = yield this.getPV();
                yield (0, helper_1.wait)(1000);
                this.logout();
                return { pv, grid: null, vcb: null };
            }
            catch (error) {
                throw new Error("FETCH 실패");
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helper_1.devLog)("로그아웃");
            this._token = '';
        });
    }
    login() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Host': 'www.cmsolar.kr',
                'Referer': 'http://www.cmsolar.kr',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36', // 변경된 User-Agent
            };
            try {
                const payload = { id: this.id, password: this.pwd, };
                // 2. URLSearchParams 객체를 사용하여 데이터 변환
                const formData = new URLSearchParams();
                formData.append('id', this.id);
                formData.append('pw', this.pwd);
                const response = yield this.ax.post('./login_ok.php', formData, { headers: headers });
                (0, helper_1.devLog)(response.data);
                const cookie = (_b = (_a = response.headers['set-cookie']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.split(';')[0];
                if (cookie) {
                    this._token = cookie;
                    (0, helper_1.devLog)(`토큰: ${this._token}`);
                }
                return this.isLogin;
            }
            catch (error) {
                console.error("CM 로그인실패");
                return false;
            }
        });
    }
    getPV() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isLogin) {
                throw new Error('CM: 토큰이 없습니다.');
            }
            try {
                const headers = {
                    'Host': 'www.cmsolar.kr',
                    'Referer': 'http://www.cmsolar.kr/plant/',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': this._token
                };
                (0, helper_1.devLog)(headers);
                const apiUrl = `./plant/sub/idx_ok.php?mode=getPlant`;
                const response = yield this.ax.get(apiUrl, { headers: { 'Cookie': this._token } });
                if (response.status === 200 && ((_a = response.data) === null || _a === void 0 ? void 0 : _a[0])) {
                    const json = (_b = response.data) === null || _b === void 0 ? void 0 : _b[0];
                    return {
                        date: new Date(),
                        pwr: (0, helper_1.intParser)(json.plant.now),
                        day: (0, helper_1.intParser)(json.plant.today),
                        mth: (0, helper_1.intParser)(json.plant.thismonth),
                        yld: (0, helper_1.intParser)(json.plant.total),
                        invs: yield this.getInverter(json.power)
                    };
                }
                else {
                    throw new Error("ERR: INV");
                }
            }
            catch (error) {
                throw new Error("ERR: INV");
            }
        });
    }
    getInverter(json) {
        return __awaiter(this, void 0, void 0, function* () {
            let invs = json.map((inv, idx) => ({
                no: idx + 1,
                stt: true,
                dcv: (0, helper_1.intParser)(inv.pow_dcv),
                dca: (0, helper_1.intParser)(inv.pow_dca),
                pwr: (0, helper_1.intParser)(inv.pow_dcp),
                day: (0, helper_1.intParser)(inv.pow_today),
                mth: (0, helper_1.intParser)(inv.pow_thismonth),
                yld: (0, helper_1.intParser)(inv.pow_totalpower),
            }));
            return invs;
        });
    }
}
exports.CM_Crawler = CM_Crawler;
//# sourceMappingURL=cm.js.map