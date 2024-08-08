import { BotFactory } from './bot/factory'
import { getSiteInfos as getSiteInfos } from './firebase/r_site_info'
import { gwtest } from './bot/gw'
import { Message, PubSub } from '@google-cloud/pubsub'
import { ISiteInfo } from './model/monit_model'



export const mntHandler = async (message: Message) => {

	const msg = JSON.parse(message.data.toString())
	console.log('BACKEND MESSAGE ==> ', msg)
	
	const taskid = msg.taskId
	const type	= msg.type		// mdel, mng, site
	const cid		= msg.cid
	const model	= msg.model
	const sid		= msg?.sid		// 존재하지 않으면 undefined
	const mng		= msg?.mng		// 존재하지 않으면 undefined

	const psub = new PubSub()
	try {


		const bot = BotFactory.getBot(model)
		await bot.initialize(cid)
		const result = await bot.crawlling()

		const dataBf = Buffer.from(JSON.stringify( { success:true, taskId: msg.taskId, result } ))
		await psub.topic('response').publishMessage({ data: dataBf })

	} catch (error) {
		const errmsg = error instanceof Error ? error.message : 'Unknown error'
		console.error('Error processing message:', error)
		const dtBuffer = Buffer.from(JSON.stringify( { taskId: msg.taskId, success:false, error:errmsg }))
		await psub.topic('response').publishMessage({ data: dtBuffer })
	}
	const dtBuffer = Buffer.from(JSON.stringify( { taskId: msg.taskId, success:false, error:msg }))
	await psub.topic('response').publishMessage({ data: dtBuffer })
	message.ack()
}


export const keeaHandler = async (message: Message) => {}
export const kescoHandler = async (message: Message) => {}

