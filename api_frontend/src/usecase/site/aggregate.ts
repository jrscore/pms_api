// import { initializeApp } from 'firebase-admin/app'
// import { Firestore, getFirestore } from 'firebase-admin/firestore'
// import { onDocumentWritten, Change, DocumentSnapshot } from 'firebase-functions/v2/firestore'

// initializeApp()
// const db = getFirestore()

// interface Site {
// 	zone: string
// 	mng: 	string
// 	lcs: 	string
// 	alias:string
// }
// interface Alias {id: string, alias: string}



// export const siteAggregate =
// 	onDocumentWritten<Change<DocumentSnapshot>, { doc: string }>( {document: 'site/{doc}'}, async (event) => {

// 		let zones: string[] = []
// 		let mngs: string[] = []
// 		let lcss: string[] = []
// 		let aliass: Alias[] = []

// 		const snapshot = await db.collection('site').where('corp', '==', 'muan').get()
// 		snapshot.forEach((doc) => {
// 			const site = doc.data() as Site
// 			if (site.zone)		zones.push(site.zone)
// 			if (site.mng)		mngs.push(site.mng)
// 			if (site.lcs)		lcss.push(site.lcs)
// 			if (site.alias)	aliass.push({ id: doc.id, alias: site.alias })
// 		})

// 		await Promise.all([
// 			updateAggregation(db, 'muan', 'zone', [...new Set(zones)]),
// 			updateAggregation(db, 'muan', 'mng',  [...new Set(mngs)]),
// 			updateAggregation(db, 'muan', 'lcs',  [...new Set(lcss)]),
// 			updateAggregation(db, 'muan', 'alias',aliass)
// 		]).catch(err => console.error(err))
// 	}
// )


// const updateAggregation = async (db: Firestore, corp: string, type: string, data: any): Promise<void> => {

// 	const doc = db.collection('site_aggr').doc(`${corp}_${type}`)
// 	const document = await doc.get()

// 	document.exists
// 		? await doc.update({ data })
// 		: await doc.set({ corp, type, data })
// }

