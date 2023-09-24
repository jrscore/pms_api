import express from 'express';
import { devLog } from '../../helper/helper';
import { AeonMonitService } from '../service/aeon_monit_service';
import { AeonRepository } from '../repository/aeon_monit_repository';

/*
	api.coredex.kr/mnt/aeon/
	api.coredex.kr/mnt/aeon/ts/			=> 최신 ts
	api.coredex.kr/mnt/aeon/ts/{:day}	=> 특정일자 ts
	api.coredex.kr/mnt/aeon/mth/{:date}	=> 특정월 mth
*/

export const router = express.Router();
const repo = new AeonRepository();
const service = new AeonMonitService(repo);

// 현재 발전량
// GET => api.coredex.kr/mnt/aeon/
router.get('/', async (req, res) => {
	try {
		const data = await service.getCurrent()
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});


// 추후 ts
// GET => api.coredex.kr/mnt/aeon/ts/
router.get('/ts', async (req, res) => {
	try {
		const date = new Date(req.query.date as string);  // 예: query param으로 "2023-05-01"을 받습니다.
		const data = await service.getDay(date)
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message); 
	}
});


// day - 일별마지막데이터 get => list
router.get('/mth', async (req, res) => {
	try {
		const year = parseInt(req.query.year as string);
		const month = parseInt(req.query.month as string) - 1; // JavaScript의 month는 0부터 시작합니다.
		const data = await service.getMonth(year, month)
		res.json(data);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
});

