import { router as mntRouter } from './mnt/router/mnt_mnt_router';
import { router as aeonRouter } from './mnt/router/mnt_aeon_router';
import { router as metaRouter } from './mnt/router/mnt_meta_router';
import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv'
import { database } from './database';
import { devLog } from './helper/helper';


/*
api.coredex.kr/mnt/
api.coredex.kr/mnt/meta/
api.coredex.kr/mnt/aeon/
*/

async function main() {
	// .env나 .env.development 중 적절한 파일을 사용하기 위한 경로 설정
	const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
	dotenv.config({ path: envPath });

	// 몽구스db 초기화
	database.initializer();

	const PORT = 8000;
	const app = express();


	app.use(cors());
	app.use(express.json());
	app.use('/mnt', mntRouter);
	app.use('/mnt/aeon', aeonRouter);
	app.use('/mnt/meta', metaRouter);


	//app.listen(PORT, callback)의 기본 동작은 0.0.0.0 (모든 네트워크 인터페이스)에서 주어진 포트를 리스닝합니다. 이것은 무슨 뜻일까요? 이는 서버가 현재 시스템에서 실행되는 모든 IP 주소에 대해 연결을 수신하겠다는 뜻입니다.
	app.listen(PORT, () => {
		console.log(`Server is running at http://localhost:${PORT}`);
	});
}

main().catch(error => {
	devLog('Error executing main:');
});