import { Request, Response } from 'express'
import PubSubService from '../../services/pubsub'
import { v4 as uuidv4 } from 'uuid'


interface ResultType { code: number, data: any }


// # ~/mnt/site/:model ? cid=xxxx & sid=xxxx
export const siteCrawlling = async (req: Request, res: Response) => {

	const model = req.params.model
	const cid = req.query.cid
	const sid = req.query.sid

	const task = uuidv4()

	const msg = { type: 'site', model, cid, sid, taskId:task }
	console.log('FRONTEND MESSAGE ==> ', msg)

	const success: ResultType = { code: 200, data: { model: model, cid } }
	const fail: ResultType = { code: 400, data: { msg: '모델별 모니터링 실패' } }


}