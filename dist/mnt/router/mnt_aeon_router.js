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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const aeon_monit_service_1 = require("../service/aeon_monit_service");
const aeon_monit_repository_1 = require("../repository/aeon_monit_repository");
/*
    api.coredex.kr/mnt/aeon/
    api.coredex.kr/mnt/aeon/ts/			=> 최신 ts
    api.coredex.kr/mnt/aeon/ts/{:day}	=> 특정일자 ts
    api.coredex.kr/mnt/aeon/mth/{:date}	=> 특정월 mth
*/
exports.router = express_1.default.Router();
const repo = new aeon_monit_repository_1.AeonRepository();
const service = new aeon_monit_service_1.AeonMonitService(repo);
// 현재 발전량
// GET => api.coredex.kr/mnt/aeon/
exports.router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getCurrent();
        res.json(data);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// 추후 ts
// GET => api.coredex.kr/mnt/aeon/ts/
exports.router.get('/ts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date(req.query.date); // 예: query param으로 "2023-05-01"을 받습니다.
        const data = yield service.getDay(date);
        res.json(data);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// day - 일별마지막데이터 get => list
exports.router.get('/mth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month) - 1; // JavaScript의 month는 0부터 시작합니다.
        const data = yield service.getMonth(year, month);
        res.json(data);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
//# sourceMappingURL=mnt_aeon_router.js.map