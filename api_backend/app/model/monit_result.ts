
export interface MonitResult {
	alias: string
	pac?: number
	pwr: number
	day: number
	stt?: boolean
	flt?: boolean
	invs: Inverter[]
}

export interface Inverter {
	no:  number
	pwr: number
	day: number
	yld: number
	run: boolean
}



