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
const mnt_mnt_router_1 = require("./mnt/router/mnt_mnt_router");
const mnt_aeon_router_1 = require("./mnt/router/mnt_aeon_router");
const mnt_meta_router_1 = require("./mnt/router/mnt_meta_router");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const helper_1 = require("./helper/helper");
/*
api.coredex.kr/mnt/
api.coredex.kr/mnt/meta/
api.coredex.kr/mnt/aeon/
*/
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // .env나 .env.development 중 적절한 파일을 사용하기 위한 경로 설정
        const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
        dotenv_1.default.config({ path: envPath });
        // 몽구스db 초기화
        database_1.database.initializer();
        const PORT = 8000;
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use('/mnt', mnt_mnt_router_1.router);
        app.use('/mnt/aeon', mnt_aeon_router_1.router);
        app.use('/mnt/meta', mnt_meta_router_1.router);
        //app.listen(PORT, callback)의 기본 동작은 0.0.0.0 (모든 네트워크 인터페이스)에서 주어진 포트를 리스닝합니다. 이것은 무슨 뜻일까요? 이는 서버가 현재 시스템에서 실행되는 모든 IP 주소에 대해 연결을 수신하겠다는 뜻입니다.
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    });
}
main().catch(error => {
    (0, helper_1.devLog)('Error executing main:');
});
