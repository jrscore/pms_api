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
const helper_1 = require("../../helper/helper");
const mnt_aeon_service_1 = require("../service/mnt_aeon_service");
const mnt_aeon_repository_1 = require("../repository/mnt_aeon_repository");
/*
    api.coredex.kr/mnt/aeon/crt/
    api.coredex.kr/mnt/aeon/day/
    api.coredex.kr/mnt/aeon/mth/
*/
exports.router = express_1.default.Router();
const repo = new mnt_aeon_repository_1.AeonMonitRepository();
const service = new mnt_aeon_service_1.AeonMonitService(repo);
// 현재 발전량
exports.router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, helper_1.devLog)('라우터진입');
        const data = yield service.getCurrent();
        res.json(data);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// 데이ts - 시간별 dt get => list
exports.router.get('mont/aeon/day', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date(req.query.date); // 예: query param으로 "2023-05-01"을 받습니다.
        const data = yield service.getDay(date);
        res.json(data);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// 월간ts - 일별마지막데이터 get => list
exports.router.get('/mnt/aeon/mth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
