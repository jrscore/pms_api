import { PubSub, Subscription, Message } from '@google-cloud/pubsub'


class PubSubService {
  private static instance: PubSubService
  private service: PubSub
  private topic: string
  private subname: string

  private constructor(topic: string, sub: string) {
    this.service = new PubSub()
    this.topic = topic
    this.subname = sub
  }


  // 싱글톤 인스턴스
  public static getInstance(topic: string, sub: string): PubSubService {
    if (!PubSubService.instance) {
      PubSubService.instance = new PubSubService(topic, sub)
    }
    return PubSubService.instance
  }
	

	// 메시지 발행
	public async publish(data: object): Promise<string> {
		const dataBuffer = Buffer.from(JSON.stringify(data))
		return await this.service.topic(this.topic).publishMessage({ data: dataBuffer })
	}


  // 응답대기
  public async response(taskId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this.service.subscription(this.subname, { flowControl: { maxMessages: 1 } })

      const timeout = this.timeoutHandler(subscription, reject, 20000)
      subscription.on('message',	this.responseHandler(taskId, timeout, subscription, resolve))
      subscription.on('error',		this.errorHandler(subscription, timeout, reject))
    })
  }

  // 타임아웃 핸들러
  private timeoutHandler(subscription: Subscription, reject: (reason?: any) => void, timeoutMs: number): NodeJS.Timeout {
    return setTimeout(() => {
      subscription.removeListener('message', this.responseHandler)
      reject(new Error('시간 초과'))
    }, timeoutMs)
  }

  // 메시지 핸들러 생성
  private responseHandler(
    taskId: string,
    timeout: NodeJS.Timeout,
    subscription: Subscription,
    resolve: (value: any) => void
  ) {
    return (msg: Message) => {
      const result = JSON.parse(msg.data.toString())
      console.log(`수신된 메시지 (taskId: ${result.taskId}):`, result)

      if (taskId === result.taskId) {
        clearTimeout(timeout)  // 타임아웃 취소
        msg.ack()  // 메시지 승인
        subscription.removeListener('message', this.responseHandler)  // 핸들러 제거
        resolve(result.result)  // 결과 반환
      } else {
        msg.nack()  // 메시지 승인하지 않음
      }
    }
  }

  // 에러 핸들러 생성
  private errorHandler(subscription: Subscription, timeout: NodeJS.Timeout, reject: (reason?: any) => void) {
    return (err: Error) => {
      console.error('Subscription 에러:', err)
      clearTimeout(timeout)  // 타임아웃 취소
      subscription.removeListener('message', this.responseHandler)  // 메시지 핸들러 제거
      reject(err)  // 에러 반환
    }
  }
}

export default PubSubService
