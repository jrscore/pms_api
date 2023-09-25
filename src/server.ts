import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express';
import { database } from './database';

import { router as mntRouter } from './mnt/router/mnt_mnt_router';
import { router as aeonRouter } from './mnt/router/mnt_aeon_router';
import { router as metaRouter } from './mnt/router/mnt_meta_router';

import { devLog } from './helper/helper';
import { CrawllingService } from './crawller/crw_server';


/*
api.coredex.kr/mnt/
api.coredex.kr/mnt/meta/
api.coredex.kr/mnt/aeon/
*/

async function main() {

	// development.env
	// .env
	const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
	dotenv.config({ path: envPath });

	// # DB 초기화
	database.initializer();

	// # EXPRESS 서버
	const PORT = 8000;
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use('/mnt', mntRouter);
	app.use('/mnt/aeon', aeonRouter);
	app.use('/mnt/meta', metaRouter);


	//app.listen(PORT, callback)의 기본 동작은 0.0.0.0 (모든 네트워크 인터페이스)에서 주어진 포트를 리스닝합니다. 이것은 무슨 뜻일까요? 이는 서버가 현재 시스템에서 실행되는 모든 IP 주소에 대해 연결을 수신하겠다는 뜻입니다.
	app.listen(PORT, () => {
		console.log(`Server RUN =>  http://localhost:${PORT}`);
	});

	// 크롤링 데몬
	// await CrawllingService.aeonDeamon('*/1 7-20 * * *', 'aeon')	//crawlling deamon
	// await CrawllingService.dailyDeamon('0 20 * * *')					//daily deamon
	// await CrawllingService.aeonDeamon('0 8,11,12,13,20 * * *');
}

main().catch(error => {
	devLog('Error => main:');
});