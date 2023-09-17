import express from 'express';
import { devLog } from '../../helper/helper';
import { AeonMonitService } from '../service/mnt_aeon_service';
import { AeonMonitRepository } from '../repository/mnt_aeon_repository';

/*
	api.coredex.kr/mnt/aeon/crt/
	api.coredex.kr/mnt/aeon/day/
	api.coredex.kr/mnt/aeon/mth/
*/

export const router = express.Router();
const repo = new AeonMonitRepository();
const service = new AeonMonitService(repo);

// 현재 발전량
router.get('/', async (req, res) => {
	try {
		devLog('라우터진입');
		const data = await service.getCurrent()
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});


// 데이ts - 시간별 dt get => list
router.get('mont/aeon/day', async (req, res) => {
	try {
		const date = new Date(req.query.date as string);  // 예: query param으로 "2023-05-01"을 받습니다.
		const data = await service.getDay(date)
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});


// 월간ts - 일별마지막데이터 get => list
router.get('/mnt/aeon/mth', async (req, res) => {
	try {
		const year = parseInt(req.query.year as string);
		const month = parseInt(req.query.month as string) - 1; // JavaScript의 month는 0부터 시작합니다.
		const data = await service.getMonth(year, month)
		res.json(data);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
});

