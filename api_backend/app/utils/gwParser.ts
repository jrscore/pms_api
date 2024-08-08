import { IGrid } from "../model/grid"


export function gwParser(json: any): IGrid[] {
	return json.data.list.map((station: any) => ({
		alias: station.stationname,
		pwr: station.pac,
		day: station.eday,
		stt: station.status === 1,
		invs: [] 
	}))
}