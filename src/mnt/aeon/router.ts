import express from 'express';
import { aeonusModel } from './model';
import mongoose from 'mongoose';
import aeonusService from './repo';


// 스키마를 모델로 컴파일
// 모델을 이용 query
const router = express.Router();
const doc = aeonusModel

/*
	api.coredex.kr/mnt/aeon/
*/
router.get('/', async (req, res) => {

	try {
		const data = await aeonusService.getCurrent()
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message);
	}

});

router.get('/adm/', async (req, res) => {
	try {
		const date = new Date(req.query.date as string);  // 예: query param으로 "2023-05-01"을 받습니다.
		const data = await aeonusService.getDay(date)
		res.json(data);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});

router.get('/adm/crt/', async (req, res) => {

	res.send('/admin/crt');
});

router.get('/adm/sht/', async (req, res) => {
	try {
		const year = parseInt(req.query.year as string);
		const month = parseInt(req.query.month as string) - 1; // JavaScript의 month는 0부터 시작합니다.
		const data = await aeonusService.getMonth
		res.json(data);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
});


export default router;