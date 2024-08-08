// src/repository/modelRepository.ts

import { database } from "../services/admin"



class MonitModelRepository {

	private collection = database.collection('monit_model')


	async getByModel(model: string) {
		const querySnapshot = await this.collection.where('model', '==', model).get()
		
		if (querySnapshot.empty) {
			return null
		}
		const doc = querySnapshot.docs[0]
		return {...doc.data()}
	}

	async addNew(model: any) {
		const docRef = await this.collection.add(model)
		return docRef.id
	}

	async update(id: string, model: any) {
		await this.collection.doc(id).set(model, { merge: true })
	}

	async deleteById(id: string) {
		await this.collection.doc(id).delete()
	}
}

export default MonitModelRepository
