import { MonitModel } from "../model/monit_model"
import { db } from "./admin"

const coll = 'monit_model'


// addnew
export const addnewMonitModel = async (modelInfo: MonitModel): Promise<void> => {
	try {
		await db.collection(coll).add(modelInfo)
		console.log('Document successfully written!')
	} catch (error) {
		console.error('Error writing document: ', error)
	}
}


// Get
export const getMonitModel = async (name: string): Promise<MonitModel | null> => {
	try {
		const snapshot = await db.collection(coll).where('model', '==', name).get()
		
		if (snapshot.empty) {
			console.log('No matching documents.')
			return null
		}
		
		const doc = snapshot.docs[0]
		return doc.data() as MonitModel
	} catch (error) {
		console.error('Error getting document: ', error)
		return null
	}
}


// Update
export const updateMonitModel = async (docId: string, modelInfo: Partial<MonitModel>): Promise<void> => {
	try {
		await db.collection(coll).doc(docId).update(modelInfo)
		console.log('Document successfully updated!')
	} catch (error) {
		console.error('Error updating document: ', error)
	}
}


// Delete
export const deleteMonitModel = async (docId: string): Promise<void> => {
	try {
		await db.collection(coll).doc(docId).delete()
		console.log('Document successfully deleted!')
	} catch (error) {
		console.error('Error deleting document: ', error)
	}
}
