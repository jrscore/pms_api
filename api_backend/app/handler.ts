import { BotFactory } from './bot/factory'
import { Message, PubSub } from '@google-cloud/pubsub'
import { GridData } from './model/grid'



export const mntHandler = async (message: Message) => {

	const pubsub = pubsubService

	const msg = JSON.parse(message.data.toString())
	const taskid = msg.taskId
	const cid = msg.cid
	const model = msg.model
	let result:GridData[]
	let responseBuffer:Buffer

	try {
		console.log(`Taskid:${taskid} && model:${model} Crawlling`)
		
		const bot = BotFactory.getBot(model)
		await bot.initialize(cid)
		result = await bot.crawlling()
		responseBuffer = Buffer.from(JSON.stringify({ success: true, taskId: msg.taskId, result }))
	} catch (error) {
		const errmsg = error instanceof Error ? error.message : 'Unknown error'
		console.error(`크롤링 처리 에러 (Taskid: ${taskid}):`, error)
		responseBuffer = Buffer.from(JSON.stringify({ success: false, taskId: msg.taskId, error: errmsg }))
	}

	// PUBSUB MESSAGE 게시
	await pubsub.topic('response').publishMessage({ data: responseBuffer })
	message.ack()
}


export const keeaHandler = async (message: Message) => {}
export const kescoHandler = async (message: Message) => {}

