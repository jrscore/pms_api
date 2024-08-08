
import { PubSub, Subscription } from '@google-cloud/pubsub'
import { mntHandler } from './handler'



const pubsub = new PubSub()

const subscriptions = [
  { name: 'monit-sub', 	handler: mntHandler },
  { name: 'keea-sub',		handler: ()=>null },
  { name: 'kesco-sub',	handler: ()=>null },

]

subscriptions.forEach(sub => {
  const subscription: Subscription = pubsub.subscription(sub.name)
  subscription.on('message', sub.handler)
  subscription.on('error', (error) => console.error(`Subscription error (${sub.name}):`, error))
})



// async function test() {

// 	const type:string	= 'model'
// 	const cid		= 'DJFp5mQmPfEXQFZRyIc0'
// 	const model	= 'octo'
// 	const sid   = ''
// 	const mng   = ''


// 	try {

// 		const bot = BotFactory.getBot(model)
// 		await bot.initialize(cid)
// 		const result = await bot.crawlling()
// 		console.log(result);
		

// 	} catch (error) {
// 		const errmsg = error instanceof Error ? error.message : 'Unknown error'
// 		console.error('Error processing message:', error)
// 	}
// }
// test()
