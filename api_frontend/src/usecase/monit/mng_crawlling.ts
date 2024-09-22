import { Request, Response } from 'express'
import PubSubService from '../../services/pubsub'
import MonitModelRepository from '../../repository/r_mnt_model'
import { v4 as uuidv4 } from 'uuid'


interface ResultType { code: number, data: any }


// # ~/mnt/mng/:model ? cid=xxxx & cid=xxxx
export const managerCrawlling = async (req: Request, res: Response) => {

	const model = req.params.model
	const cid = req.query.cid
	const mng = req.query.mng
	const task = uuidv4()

	const msg = { type: 'mng', model, cid, mng, taskId:task }
	console.log('FRONTEND MESSAGE ==> ', msg)

	const success: ResultType = { code: 200, data: { model: model, cid } }
	const fail: ResultType = { code: 400, data: { msg: '모델별 모니터링 실패' } }

	const pubsub = PubSubService.getInstance('monit', 'response-sub')
	try {
		await pubsub.publish(msg)
		console.log('PSUB MSG_ID =>', task)
		const result = await pubsub.response(task)
		res.status(200).send(result)
	} catch (error) {
		fail.data.msg = (error as Error).message
		res.status(500).send(fail)
	}
}