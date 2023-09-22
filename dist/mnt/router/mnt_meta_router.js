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
const mnt_meta_servcie_1 = __importDefault(require("../service/mnt_meta_servcie"));
const mnt_meta_repository_1 = require("../repository/mnt_meta_repository");
const helper_1 = require("../../helper/helper");
/*
    모니터링 리스트 데이터테이블 관리
    api.coredex.kr/mnt/meta					api 기본주소
*/
const repo = new mnt_meta_repository_1.MntMetaRepository();
const service = new mnt_meta_servcie_1.default(repo);
exports.router = express_1.default.Router();
// api.coredex.kr/mnt/meta/ {sid}
// GET
exports.router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield service.get(id);
    res.json({ message: '모니터링 리스트 조회', data });
}));
// Get List
// api.coredex.kr/mnt/meta/corp/ {cid}
// curl http://localhost:8000/mnt/meta/corp/muan
exports.router.get('/corp/:corp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { corp } = req.params;
    const data = yield service.getList(corp);
    res.json({ message: '모니터링 리스트 조회', data });
}));
// Get List
// api.coredex.kr/mnt/meta/corp/ {cid} / {model}
exports.router.get('/corp/:corp/:model', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { corp, model } = req.params;
    const data = yield service.getList(corp, model);
    res.json({ message: '모니터링 리스트 조회', data });
}));
// ADDNEW
// api.coredex.kr/mnt/meta/
// curl -X POST -H "Content-Type: application/json" -d '{"corp": "muan", "model":"model", "zone":"zn", "alias":"ali", "url":"url", "id":"dd", "pwd":"1234" }' http://localhost:8000/mnt/meta/
exports.router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.devLog)(req.body);
    const newItem = yield service.addItem(req.body);
    res.json({ message: '모니터링 항목 추가', data: newItem });
}));
// 모니터링 항목 수정 (PUT)
// api.coredex.kr/mnt/meta/
exports.router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedItem = yield service.updateItem(req.params.id, req.body);
    res.json({ message: '모니터링 항목 수정', data: updatedItem });
}));
// 모니터링 항목 삭제 (DELETE)
// api.coredex.kr/mnt/meta/
// curl -X DELETE http://localhost:8000/mnt/meta/65066dc6246e82023bfddc7d
exports.router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedId = yield service.deleteItem(req.params.id);
    res.json({ message: '모니터링 항목 삭제', id: deletedId });
}));
