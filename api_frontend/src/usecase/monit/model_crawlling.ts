import { Request, Response } from 'express'
import PubSubService from '../../services/pubsub'
import MonitModelRepository from '../../repository/r_mnt_model'
import { v4 as uuidv4 } from 'uuid'
import debug from 'debug'

interface ResultType { code: number, data: any }


// # ~/mnt/mng/ model ? cid=xxxx
export const modelCrawlling = async (req: Request, res: Response) => {

	const cid = req.query.cid
	const model = req.params.model
	const taskid = uuidv4()

	const validModels = ['cm', 'octo', 'hd', 'dass', 'eco', 'rems', 'en']
	if (!validModels.includes(model)) 
		return res.status(400).send({ code: 400, data: { msg: '유효하지 않은 model 값입니다.' } })
	if (!cid) 
		return res.status(400).send({ code: 400, data: { msg: '유효하지 않은 cid 값입니다.' } })

	const msg = { type: 'model', model, cid, taskId: taskid }
	console.log('새로운 Pub/Sub 메시지 발행 준비:', msg)

	const success: ResultType = { code: 200, data: { model, cid } }
	const failure: ResultType = { code: 400, data: { msg: '모델별 모니터링 실패' } }


	try {
		const pubsubService = PubSubService.getInstance('monit', 'response-sub')
		await pubsubService.publish({ type: 'model', model, cid, taskId: taskid })
		const result = await pubsubService.response(taskid)
		res.status(200).send(result)
	} catch (error) {
		failure.data.msg = (error as Error).message
		console.error('에러 발생:', error)
		res.status(500).send(failure)
	}

}