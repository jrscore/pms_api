
import admin from "firebase-admin"

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  databaseURL: "https://cdx-pms-default-rtdb.asia-southeast1.firebasedatabase.app"
})


export const database = admin.firestore()
export const messaging = admin.messaging()
export const auth = admin.auth()
