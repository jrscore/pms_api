import express from 'express';
import { devLog } from '../../helper/helper';
import { MetaService } from '../../meta/meta_service';

/*
	모니터링 테이블 관리
	api.coredex.kr/mnt/meta					api 기본주소
*/


export const router = express.Router();

// GET: api.coredex.kr/mnt/meta/ {sid}
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const data = await MetaService.getById(id);
	res.json({ message: '모니터링 리스트 조회', data });
});

// GET:LIST => api.coredex.kr/mnt/meta/corp/ {cid}			curl http://localhost:8000/mnt/meta/corp/muan
router.get('/corp/:corp', async (req, res) => {
	const { corp } = req.params;
	const data = await MetaService.getListByCorp(corp);
	res.json({ message: '모니터링 리스트 조회', data });
});

// GET:LIST => api.coredex.kr/mnt/meta/corp/ {cid} / {model}
router.get('/corp/:corp/:model', async (req, res) => {
	const { corp, model } = req.params;
	const data = await MetaService.getListByModel(model);
	res.json({ message: '모니터링 리스트 조회', data });
});


// POST => api.coredex.kr/mnt/meta/					curl -X POST -H "Content-Type: application/json" -d '{"corp": "muan", "model":"model", "zone":"zn", "alias":"ali", "url":"url", "id":"dd", "pwd":"1234" }' http://localhost:8000/mnt/meta/
router.post('/', async (req, res) => {
	devLog(req.body);
	const newItem = await MetaService.addnew(req.body);
	res.json({ message: '모니터링 항목 추가', data: newItem });
});


// 모니터링 항목 수정 (PUT)
// api.coredex.kr/mnt/meta/
router.put('/:id', async (req, res) => {
	const updatedItem = await MetaService.update(req.params.id, req.body);
	res.json({ message: '모니터링 항목 수정', data: updatedItem });
});

// 모니터링 항목 삭제 (DELETE)
// api.coredex.kr/mnt/meta/
// curl -X DELETE http://localhost:8000/mnt/meta/65066dc6246e82023bfddc7d
router.delete('/:id', async (req, res) => {
	const deletedId = await MetaService.delete(req.params.id);
	res.json({ message: '모니터링 항목 삭제', id: deletedId });
});
