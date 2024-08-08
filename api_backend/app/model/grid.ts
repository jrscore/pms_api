
export interface IGrid {
	alias: string
	pac?: number
	pwr: number
	day: number
	stt?: boolean
	flt?: boolean
	invs: IInverter[]
}

export interface IInverter {
	no:  number
	pwr: number
	day: number
	yld: number
	run: boolean
}



