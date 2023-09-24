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
exports.OCTO_Crawler = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../../helper/helper");
class OCTO_Crawler {
    get isLogin() {
        return !!this._token;
    }
    constructor(meta) {
        this.headers = {};
        this.sitecode = 6792;
        this._token = '';
        this.ax = axios_1.default.create();
        this.url = meta.url;
        this.id = meta.id;
        this.pwd = meta.pwd;
        this.headers = {
            'Accept': `application/json, text/plain, */*`,
            'Content-Type': 'text/plain',
            'Origin': 'https://www.octo.co.kr',
            'Referer': 'https://www.octo.co.kr/',
        };
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isLogin) {
                    yield this.login();
                }
                yield (0, helper_1.wait)(3000);
                const grid = yield this.getGrid();
                yield (0, helper_1.wait)(3000);
                const vcb = yield this.getVcb();
                yield (0, helper_1.wait)(3000);
                const pv = yield this.getPV();
                yield (0, helper_1.wait)(3000);
                return { grid, vcb, pv };
            }
            catch (error) {
                throw new Error("FETCH 실패");
            }
        });
    }
    getGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    login() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, helper_1.devLog)("로그인시도");
                const payload = {
                    userId: this.id,
                    userPass: this.pwd,
                    referrer: 'ems_customer_pc_web'
                };
                const response = yield this.ax.post(`${this.url}/authority/login`, payload, { headers: this.headers });
                const json = response.data;
                if ((_b = (_a = json.response) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userKey) { // => optional chaining
                    this._token = (_d = (_c = json.response) === null || _c === void 0 ? void 0 : _c.session) === null || _d === void 0 ? void 0 : _d.userKey;
                }
                return true;
            }
            catch (error) {
                console.error("로그인실패", error);
                return false;
            }
        });
    }
    getVcb() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = `${this.url}/meter/data`;
                const payload = {
                    mcno: this.sitecode,
                    uKey: this._token,
                    time: (0, helper_1.generateTimeBasedOnNow)() // time: 4156239939
                };
                const response = yield this.ax.get(apiUrl, { headers: this.headers, params: payload });
                if (response.status === 200 && ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.meter)) {
                    const json = response.data.response.meter[0];
                    return {
                        time: new Date(json.updatedAt),
                        acb_yld: json.meters[0].activeKwh,
                        vcb_yld: json.meters[2].activeKwh
                    };
                }
                else {
                    throw new Error("ERR: VCB");
                }
            }
            catch (error) {
                throw new Error("ERR: VCB");
            }
        });
    }
    getPV() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = `${this.url}/inverter/daytotal`;
                const payload = {
                    mcno: this.sitecode,
                    uKey: this._token,
                    time: (0, helper_1.generateTimeBasedOnNow)()
                };
                const response = yield this.ax.get(apiUrl, { headers: this.headers, params: payload });
                if (response.status === 200 && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.response)) {
                    const json = (_b = response.data) === null || _b === void 0 ? void 0 : _b.response;
                    return {
                        date: new Date(),
                        pwr: (0, helper_1.intParser)(json.ackw),
                        day: (0, helper_1.intParser)(json.dayTotal),
                        mth: 0,
                        yld: (0, helper_1.intParser)(json.total),
                        invs: yield this.getInverter()
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
    getInverter() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = `${this.url}/inverter/data`;
                const payload = {
                    mcno: this.sitecode,
                    uKey: this._token,
                    time: (0, helper_1.generateTimeBasedOnNow)()
                };
                const response = yield this.ax.get(apiUrl, { headers: this.headers, params: payload });
                if (response.status === 200 && ((_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.inverters[0]) === null || _c === void 0 ? void 0 : _c.inverters)) {
                    const json = (_f = (_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d.response) === null || _e === void 0 ? void 0 : _e.inverters[0]) === null || _f === void 0 ? void 0 : _f.inverters;
                    let invs = json.map((inv, idx) => ({
                        no: idx + 1,
                        stt: inv.isRun,
                        dcv: (0, helper_1.intParser)(inv.dcv),
                        dca: (0, helper_1.intParser)(inv.dca),
                        pwr: (0, helper_1.intParser)(inv.ackw),
                        day: (0, helper_1.intParser)(inv.dayTotal),
                        yld: (0, helper_1.intParser)(inv.total)
                    }));
                    return invs;
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
}
exports.OCTO_Crawler = OCTO_Crawler;
//# sourceMappingURL=octo.js.map