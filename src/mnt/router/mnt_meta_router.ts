import express from 'express';
import MntMetaService from '../service/mnt_meta_servcie';
import { MntMetaRepository } from '../repository/mnt_meta_repository';
import { devLog } from '../../helper/helper';

/*
	모니터링 리스트 데이터테이블 관리
	api.coredex.kr/mnt/meta					api 기본주소
*/


const repo = new MntMetaRepository();
const service = new MntMetaService(repo);
export const router = express.Router();

// api.coredex.kr/mnt/meta/ {sid}
// GET
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const data = await service.get(id);
	res.json({ message: '모니터링 리스트 조회', data });
});

// Get List
// api.coredex.kr/mnt/meta/corp/ {cid}
// curl http://localhost:8000/mnt/meta/corp/muan
router.get('/corp/:corp', async (req, res) => {
	const {corp}  = req.params;
	const data = await service.getList(corp);
	res.json({ message: '모니터링 리스트 조회', data });
});

// Get List
// api.coredex.kr/mnt/meta/corp/ {cid} / {model}
router.get('/corp/:corp/:model', async (req, res) => {
	const { corp, model } = req.params;
	const data = await service.getList(corp, model);
	res.json({ message: '모니터링 리스트 조회', data });
});


// ADDNEW
// api.coredex.kr/mnt/meta/
// curl -X POST -H "Content-Type: application/json" -d '{"corp": "muan", "model":"model", "zone":"zn", "alias":"ali", "url":"url", "id":"dd", "pwd":"1234" }' http://localhost:8000/mnt/meta/
router.post('/', async (req, res) => {
	devLog(req.body);
	const newItem = await service.addItem(req.body);
	res.json({ message: '모니터링 항목 추가', data: newItem });
});


// 모니터링 항목 수정 (PUT)
// api.coredex.kr/mnt/meta/
router.put('/:id', async (req, res) => {
	const updatedItem = await service.updateItem(req.params.id, req.body);
	res.json({ message: '모니터링 항목 수정', data: updatedItem });
});

// 모니터링 항목 삭제 (DELETE)
// api.coredex.kr/mnt/meta/
// curl -X DELETE http://localhost:8000/mnt/meta/65066dc6246e82023bfddc7d
router.delete('/:id', async (req, res) => {
	const deletedId = await service.deleteItem(req.params.id);
	res.json({ message: '모니터링 항목 삭제', id: deletedId });
});
