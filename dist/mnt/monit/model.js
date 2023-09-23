"use strict";
// // import { Ivcb } from './model';
// import mongoose, { Schema, Document, Types, InferSchemaType } from 'mongoose';
// // schema => model=> doc
// const inv_schema = new Schema({
// 	no: Number,
// 	stt: Boolean,
// 	dcv: Number,
// 	dca: Number,
// 	pwr: Number,
// 	day: Number,
// 	yld: Number,
// },{ _id: false })
// const vcb_schema = new Schema({
// 	time: Date,
// 	acb_yld: Number,
// 	vcb_yld: Number,
// },{ _id: false })
// const monit_schema = new Schema({
// 	date: Date,
// 	pwr: Number,
// 	day: Number,
// 	yld: Number,
// 	vcb: [vcb_schema],
// 	invs: [inv_schema]
// }
// );
// export type Inverter = InferSchemaType<typeof inv_schema>
// export type Vcb = InferSchemaType<typeof vcb_schema>
// 		 type Monit = InferSchemaType<typeof monit_schema>
// export const MonitModel = mongoose.model<Monit>('monit', monit_schema);
///////////////////////////////////////////////////////
//				interface schema => 모델생성
///////////////////////////////////////////////////////
// interface IMonit extends Document {
// 	zone: string;
// 	name: string;
// 	run: string;
// 	pwr: string;
// 	day: string;
// 	mth: string;
// 	yld: string;
// 	vcb: Ivcb;
// 	invs: IInverter[];
// }
// export interface Ivcb {
// 	time: string;
// 	acb_yld: string;
// 	vcb_yld: string;
// }
// export interface IInverter {
// 	no: string;
// 	stt: string;
// 	pwr: string;
// 	day: string;
// 	mth: string;
// 	yld: string;
// }
