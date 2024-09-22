
import { ISiteMonitInfo } from "../entity/monit_model"
import { database } from "../services/admin"




export class SiteMonitInfoRepository {

  private col = database.collection('monit')

	
	async get(id: string) {
		const doc = await this.col.doc(id).get()
		return doc.exists ? doc.data() : null
	}

	async getList(cid: string, model: string) {
		try {
			const snapshot = await this.col.where('cid', '==', cid).where('model', '==', model).get()
			
			if (snapshot.empty) {
				return []
			}
			
			const list: ISiteMonitInfo[] = []
			snapshot.forEach(doc => {
				list.push(doc.data() as ISiteMonitInfo)
			})
			
			return list
		} catch (error) {
			console.error('Error getting document: ', error)
			return []
		}
	}

	async addNew(model: any) {
		const docRef = await this.col.add(model)
		return docRef.id
	}

	async update(id: string, model: any) {
		await this.col.doc(id).set(model, { merge: true })
	}

	async delete(id: string) {
		await this.col.doc(id).delete()
	}
}