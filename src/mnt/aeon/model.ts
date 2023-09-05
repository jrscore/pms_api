// import { Ivcb } from './model';
import mongoose, { Schema, InferSchemaType } from 'mongoose';

// schema => model=> doc
const inv_schema = new Schema({
	no: Number,
	stt: Boolean,
	dcv: Number,
	dca: Number,
	pwr: Number,
	day: Number,
	yld: Number,
}, { _id: false })

const vcb_schema = new Schema({
	time: Date,
	acb_yld: Number,
	vcb_yld: Number,
}, { _id: false })

const monit_schema = new Schema({
	date: Date,
	pwr: Number,
	day: Number,
	yld: Number,
	vcb: [vcb_schema],
	invs: [inv_schema]
}
);


export type Inverter = InferSchemaType<typeof inv_schema>
export type Vcb = InferSchemaType<typeof vcb_schema>
type Monit = InferSchemaType<typeof monit_schema>
export const aeonusModel = mongoose.model<Monit>('monit', monit_schema);
