import { PubSub, Subscription, Message } from '@google-cloud/pubsub'

class PubSubService {
  private pubsub: PubSub
  private topic: string
  private subname: string

  constructor(topic: string, sub: string) {
    this.pubsub = new PubSub()
    this.topic = topic
    this.subname = sub
  }


  public async publish(data: object): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify( data ))
    return await this.pubsub.topic(this.topic).publishMessage({ data: dataBuffer })
  }


  public waitForResponse(taskId: string, timeoutMs: number = 20000): Promise<any> {

    return new Promise((resolve, reject) => {
      const subscription: Subscription = this.pubsub.subscription(this.subname, {flowControl: {maxMessages: 1} })

      const timeout = setTimeout(() => {
        subscription.removeListener('message', messageHandler)
        reject(new Error('시간초과'))
      }, timeoutMs)

      const messageHandler = (msg: Message) => {
        const result = JSON.parse(msg.data.toString())
        console.log('Relation ===>', taskId)
        console.log('Response ===>', result)

        if (result.taskId === taskId) {
          clearTimeout(timeout)
          resolve(result.result)
          msg.ack()
          subscription.removeListener('message', messageHandler)
        } else {
          msg.nack() // 메시지를 승인하지 않음
        }
      }

      subscription.on('message', messageHandler)

      // 초기화
      subscription.on('error', (err) => {
        console.error('Subscription error:', err)
        clearTimeout(timeout)
        reject(err)
      })
    })
  }
}

export default PubSubService