// import { OCTO_Crawler } from './octo'

// import * as functions from 'firebase-functions/v1'
// import * as admin from 'firebase-admin'

// admin.initializeApp()
// const db = admin.firestore()




// exports.obmonit = functions.pubsub.schedule('*/3 * * * *')
// 	.timeZone('Asia/Seoul')
// 	.onRun(async (context) => {

// 		const octo = new OCTO_Crawler()

// 		try {
// 				const result = await octo.fetch()

// 				// Firestore의 logs 컬렉션에 결과 저장
// 				await db.collection('logs').add({
// 					data: result,
// 					timestamp: admin.firestore.FieldValue.serverTimestamp()
// 				})
// 		} catch (error) {
// 				console.error('OBMONIT ERR', error)
// 		}

// 		return null
// 	})