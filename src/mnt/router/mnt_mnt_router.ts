import express from 'express';
import { MonitService } from '../service/monit_service';

/*
	api.coredex.kr/mnt/
	
	api.coredex.kr/mnt/adm/lst					모니터링 리스트관리



	api.coredex.kr/mnt/adm/{cid}				회사 전체
	api.coredex.kr/mnt/adm/{sid}				회사 전체
	api.coredex.kr/mnt/adm/{cid}/{sid}		회사-발전소 현재
	*/

export const router = express.Router();

// # api.coredex.kr/mnt/	=> getlist 전체사이트를 가져와서 fe에 보여준다
router.get('/mnt/:cid', async (req, res) => {
	const service = new MonitService()
	const data = await service.fetchData();
	res.json(data);
});


// 현재상태
router.get('/mnt/crt/:sid', async (req, res) => {
	const service = new MonitService()
	const data = await service.fetchData();
	res.json(data);
});


// 금일리스트
router.get('/mnt/day/:sid', async (req, res) => {
	const service = new MonitService()
	const data = await service.fetchData();
	res.json(data);
});

// 금월리스트
router.get('/mnt/mth/:sid', async (req, res) => {
	const service = new MonitService()
	const data = await service.fetchData();
	res.json(data);
});
