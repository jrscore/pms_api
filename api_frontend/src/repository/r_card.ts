import { database } from "../services/admin"


export class CardRepository {

	private col = database.collection('mnt_site')
	
	async addnew(model: any) {
		const docRef = await this.col.add(model)
		return docRef.id
	}


	async get(id: string) {
		const doc = await this.col.doc(id).get()
		return doc.exists ? doc.data() : null
	}


	async getlist(id: string) {
		const doc = await this.col.doc(id).get()
		return doc.exists ? doc.data() : null
	}


	async update(id: string, model: any) {
		await this.col.doc(id).set(model, { merge: true })
	}


	async delete(id: string) {
		await this.col.doc(id).delete()
	}
}