"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = require("./model");
/*
    api.coredex.kr/mnt/aeon/
*/
const router = express_1.default.Router();
// 스키마를 모델로 컴파일
// 모델을 이용 query
const doc = model_1.aeonusModel;
router.get('/', async (req, res) => {
});
router.get('/adm/', (req, res) => {
});
router.get('/adm/crt/', async (req, res) => {
});
router.get('/adm/sht/', (req, res) => {
    res.send('admin -sheet');
});
exports.default = router;
