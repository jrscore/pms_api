
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
