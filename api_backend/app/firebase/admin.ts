import * as serviceAccount from './cdx-pms-admsdk.json'
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://cdx-pms-default-rtdb.asia-southeast1.firebasedatabase.app'
})


const db = getFirestore()

export {db}



