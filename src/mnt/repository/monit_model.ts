import mongoose from 'mongoose';

/*
일반모니터링 시나리오
 - meta collection에서 데이터를 이용하여 deamon을 구동
 - meta 리스트를 fe에 전달
 - meta 리스트를 api fetch

collection 구성
#1. monit
	- log  		: suid, dt(yymmdd-hhmm)
	- ts  		: suid, dt
	- day  		: suid, dt
	- mth  		: suid, dt
*/


const gridSchema = new mongoose.Schema({
	time: Date,
	inmth: Number,
	incrt: Number,
	genmth: Number,
	gencrt: Number,
	ct: Number,
},{ _id : false });

const vcbSchema = new mongoose.Schema({
	time: Date,
	acb_yld: Number,
	vcb_yld: Number,
},{ _id : false });


const inverterSchema = new mongoose.Schema({
	no: Number,
	stt: Boolean,
	dcv: Number,
	dca: Number,
	pwr: Number,
	day: Number,
	mth: Number,
	yld: Number,
},{ _id : false });

const pvSchema = new mongoose.Schema({
	date: Date,
	pwr: Number,
	day: Number,
	mth: Number,
	yld: Number,
	invs: [inverterSchema]
},{ _id : false });



const monitSchema = new mongoose.Schema({
	grid: { type: gridSchema, default: null },
	vcb: { type: vcbSchema, default: null },
	pv: pvSchema
});



export type Inverter = {
	no: Number,
	stt: Boolean,
	dcv: Number,
	dca: Number,
	pwr: Number,
	day: Number,
	mth: Number,
	yld: Number,
}

export type PV = {
	date: Date,
	pwr: Number,
	day: Number,
	mth: Number,
	yld: Number,
	invs: Inverter[]
}

export type Vcb = {
	time: Date,
	acb_yld: Number,
	vcb_yld: Number,
}

export type Grid = {
	time: Date,
	inmth: Number,
	incrt: Number,
	genmth: Number,
	gencrt: Number,
	ct: Number,
}

export type Monit = {
	grid: Grid | null,
	vcb: Vcb | null,
	pv: PV
}

export const monitModel = mongoose.model<Monit>('monit', monitSchema);
export const aeonModel = mongoose.model<Monit>('log', monitSchema);