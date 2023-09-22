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
const mnt_mnt_service_1 = require("../service/mnt_mnt_service");
/*
    api.coredex.kr/mnt/
    
    api.coredex.kr/mnt/adm/lst					모니터링 리스트관리



    api.coredex.kr/mnt/adm/{cid}				회사 전체
    api.coredex.kr/mnt/adm/{sid}				회사 전체
    api.coredex.kr/mnt/adm/{cid}/{sid}		회사-발전소 현재
    */
exports.router = express_1.default.Router();
// # api.coredex.kr/mnt/	=> getlist 전체사이트를 가져와서 fe에 보여준다
exports.router.get('/mnt/:cid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = new mnt_mnt_service_1.MonitService();
    const data = yield service.fetchData();
    res.json(data);
}));
// 현재상태
exports.router.get('/mnt/crt/:sid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = new mnt_mnt_service_1.MonitService();
    const data = yield service.fetchData();
    res.json(data);
}));
// 금일리스트
exports.router.get('/mnt/day/:sid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = new mnt_mnt_service_1.MonitService();
    const data = yield service.fetchData();
    res.json(data);
}));
// 금월리스트
exports.router.get('/mnt/mth/:sid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = new mnt_mnt_service_1.MonitService();
    const data = yield service.fetchData();
    res.json(data);
}));
