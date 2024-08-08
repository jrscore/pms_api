
const { initializeApp } = require('firebase-admin/app')
const { getFirestore  } = require('firebase-admin/firestore')
const { onDocumentWritten } = require("firebase-functions/v2/firestore")

initializeApp()


exports.siteAggregation = onDocumentWritten('/site/{doc}', async (change, context) => {

	const db = getFirestore()

	const siteSnapshot = await db.collection('site').where('safety', '==', 'muan').get() // 변수 이름 변경
	let zones = [], mng = [], lcs = [], alias = []
	
	siteSnapshot.forEach(doc => { // siteSnapshot으로 변경
		const data = doc.data()
		data.zone && zones.push(data.zone)
		data.mng && mng.push(data.mng)
		data.lcs && lcs.push(data.lcs)
		data.alias && alias.push({ id:doc.id, alias:data.alias })
	})

	// 집계 데이터 생성 및 저장 로직은 유지
	const aggregations = [
		{corp: 'muan', type: 'zone',  data: [...new Set(zones)]},
		{corp: 'muan', type: 'mng',   data: [...new Set(mng)]},
		{corp: 'muan', type: 'lcs',   data: [...new Set(lcs)]},
		{corp: 'muan', type: 'alias', data: alias},
	]

	await Promise.all(aggregations.map(aggr => db.collection('site_aggr').add(aggr)))
})