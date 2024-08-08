
const { initializeApp } = require('firebase-admin/app')
const { getFirestore  } = require('firebase-admin/firestore')
const { onDocumentWritten } = require("firebase-functions/v2/firestore")

initializeApp()


exports.siteAggregation = onDocumentWritten('/site/{doc}', async (change, context) => {

	const db = getFirestore()

	const snapshot = await db.collection('site').where('corp', '==', 'muan').get() // 변수 이름 변경
	let zones = [], mngs = [], lcs = [], alias = [], tags = [], safes = []
	
	snapshot.forEach(doc => { 
		const data = doc.data()
		data.zone 	&& zones.push(data.zone)
		data.mng 	&& mngs.push(data.mng)
		data.lcs 	&& lcs.push(data.lcs)
		data.tags	&& tags.push(...data.tags)
		data.alias 	&& alias.push({ id:doc.id, alias:data.alias })
		data.bill.safe && safes.push(data.bill.safe)

	})

	await Promise.all([
		db.collection('site_meta').doc('muan_zone').set( {corp: 'muan', type: 'zone',  data: [...new Set(zones)] }),
		db.collection('site_meta').doc('muan_mngs').set( {corp: 'muan', type: 'mng',   data: [...new Set(mngs)]  }),
		db.collection('site_meta').doc('muan_lcss').set( {corp: 'muan', type: 'lcs',   data: [...new Set(lcs)]   }),
		db.collection('site_meta').doc('muan_tags').set( {corp: 'muan', type: 'tag',   data: [...new Set(tags)]  }),
		db.collection('site_meta').doc('muan_alis').set( {corp: 'muan', type: 'alias', data: alias } ),
	])


	// 추가된 기능: mng 별로 count, score를 계산하여 집계
	const mngAggre = mngs.reduce((acc, mng) => {
		if (!acc[mng]) {
			acc[mng] = { count: 0, score: 0 }
		}

		const filtered = snapshot.docs.filter(doc => doc.data().mng === mng)
		acc[mng].count = filtered.length
		acc[mng].score = filtered.reduce((sum, doc) => sum + (doc.data().score || 0), 0)

		return acc
	}, {})

	const mngAggregation = Object.entries(mngAggre).map(([mng, { count, score }]) => ({
		mng,
		count,
		score
	}))

	await db.collection('site_meta').doc('muan_aggr').set({
		corp: 'muan',
		type: 'aggre',
		data: mngAggregation,
	})
})
