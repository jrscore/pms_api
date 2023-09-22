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
exports.DNE_Crawler = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../../../helper/helper");
class DNE_Crawler {
    get isLogin() {
        return !!this._token;
    }
    constructor(meta) {
        this.headers = {};
        this.sitecode = '';
        this._token = '';
        this.cookie = null;
        this.url = meta.url;
        this.id = meta.id;
        this.pwd = meta.pwd;
        this.ax = axios_1.default.create({ baseURL: this.url, withCredentials: true });
        const headers = {
        // 'Accept': 'application/json, text/javascript, */*; q=0.01',
        // 'Accept-Encoding': 'gzip, deflate',
        // 'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        // 'Connection': 'keep-alive',
        // 'Host': 'www.cmsolar.kr',
        // 'Referer': 'http://www.cmsolar.kr',
        // 'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36', // 변경된 User-Agent
        };
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.login();
                if (!this.isLogin)
                    throw new Error("Token not set!");
                yield (0, helper_1.wait)(3000);
                const grid = yield this.getGrid();
                yield (0, helper_1.wait)(3000);
                const vcb = yield this.VCB();
                yield (0, helper_1.wait)(3000);
                const pv = yield this.getPV();
                yield (0, helper_1.wait)(3000);
                this.logout();
                return { pv, vcb, grid };
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, helper_1.devLog)('로그인시도');
                // 2. URLSearchParams 객체를 사용하여 데이터 변환
                const formData = new URLSearchParams();
                formData.append('__VIEWSTATE', '/wEPDwUKMTEwNjU2MzEzMmRkEPloW22nm+2u6V40LxFcfO1zqxM=');
                formData.append('__VIEWSTATEGENERATOR', '29B1BD26');
                formData.append('__EVENTVALIDATION', '/wEWAwKE6f/4BAK3g9/5BgK6g9/5BpAPO6WNZml2xC9MhP0kjulQ1fI4');
                formData.append('Txt_1', this.id);
                formData.append('Txt_2', this.pwd);
                const response = yield this.ax.post('https://www.qs2200.co.kr/SrMain/SM010.aspx', formData);
                (0, helper_1.devLog)(response.data);
                const redirectMatch = response.data.match(/location\.replace\(["']?(.+?)["']?\)/);
                if (redirectMatch && redirectMatch[1]) {
                    const redirectURL = redirectMatch[1];
                    (0, helper_1.devLog)(redirectURL);
                    // 리다이렉트되는 페이지로 요청
                    const redirectResponse = yield this.ax.get(redirectURL);
                    (0, helper_1.devLog)(redirectResponse.data);
                    //   if(response.status === 200 && response.data.includes('location.replace')) {
                    // 		const redirectMatch = response.data.match(/location\.replace\(["']?(.+?)["']?\)/);
                    // 		if (redirectMatch && redirectMatch[1]) {
                    // 			 const redirectURL = redirectMatch[1];
                    // 			 console.log(`Should redirect to: ${redirectURL}`);
                    // 			 // 여기서 필요한 처리를 수행합니다.
                    // 		}
                    //   }
                    //   } else {
                    //       console.error('Login failed with status:', response.status);
                }
                return response.data;
            }
            catch (error) {
                console.error("로그인실패", error);
            }
        });
    }
    getPV() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._token) {
                throw new Error('Session cookie 실패');
            }
            try {
                const headers = {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Host': 'www.cmsolar.kr',
                    'Referer': 'http://www.cmsolar.kr/plant/',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': this._token
                };
                (0, helper_1.devLog)(headers);
                const apiUrl = `./plant/sub/idx_ok.php?mode=getPlant`;
                const response = yield this.ax.get(apiUrl, { headers: { 'Cookie': this._token } });
                (0, helper_1.devLog)(response.data);
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
            (0, helper_1.devLog)(json);
            try {
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
            }
            catch (error) {
                throw new Error("ERR: INV");
            }
        });
    }
    getGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    VCB() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
exports.DNE_Crawler = DNE_Crawler;
