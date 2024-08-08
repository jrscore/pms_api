import { ISiteInfo } from "../model/monit_model"
import { db } from "./admin"


const collectionName = 'monit'


// Addnew
export const addSiteInfo = async (monitMeta: ISiteInfo): Promise<void> => {
	try {
		await db.collection(collectionName).add(monitMeta)
		console.log('Document successfully written!')
	} catch (error) {
		console.error('Error writing document: ', error)
	}
}


// GetById
export const getSiteById = async (sid: string): Promise<ISiteInfo|null> => {
  try {
    const doc = await db.collection(collectionName).doc(sid).get()

    if (!doc.exists) {
      console.error('No such document!')
      return null
    }
		return doc.data() as ISiteInfo
  } catch (error) {
    console.error('Error getting document: ', error)
    return null
  }
}

// GetList
export const getSiteInfos = async ( cid:string, model:string): Promise<ISiteInfo[]> => {
	try {
		const snapshot = await db.collection(collectionName)
			.where('cid', 	'==', cid)
			.where('model', '==', model)
			.get()
		
		if (snapshot.empty) {
			return []
		}
		
		const list: ISiteInfo[] = []
		snapshot.forEach(doc => {
			list.push(doc.data() as ISiteInfo)
		})
		
		return list
	} catch (error) {
		console.error('Error getting document: ', error)
		return []
	}
}

// Update
export const updateSiteInfo = async (docId: string, monitMeta: Partial<ISiteInfo>): Promise<void> => {
	try {
		await db.collection(collectionName).doc(docId).update(monitMeta)
		console.log('Document successfully updated!')
	} catch (error) {
		console.error('Error updating document: ', error)
	}
}

// Delete
export const deleteSiteInfo = async (docId: string): Promise<void> => {
	try {
		await db.collection(collectionName).doc(docId).delete()
		console.log('Document successfully deleted!')
	} catch (error) {
		console.error('Error deleting document: ', error)
	}
}



// Upload
export const uploadBatchMonitInfo = async(dummy:any[]) => {

	try {
		const batch = db.batch()
		dummy.forEach(data => {
			const ref = db.collection('monit').doc()
			batch.set(ref, data)
		})
		await batch.commit()
	} catch (error) {
		console.error('Error deleting document: ', error)
	}

}