"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
/*
    api.coredex.kr/mnt/
    dk_mnt_repo에 대한 api
    모든 사이트 모니터링 요청
    mnt/stt/{cid}				회사 전체
    mnt/stt/{sid}				회사 전체
    mnt/stt/{cid}/{sid}		회사-발전소 현재

*/
const router = express_1.default.Router();
router.get('/stt/{cid}', (req, res) => {
    res.send('회사전체 모니터링 pptr 요청');
});
router.get('/stt/{sid}', (req, res) => {
    res.send('사이트 모니터링 pptr 요청');
});
router.get('/stt/{cid}/{sid}', (req, res) => {
    res.send('회사 사이트 모니터링 pptr 요청');
});
exports.default = router;
