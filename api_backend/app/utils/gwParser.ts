import { MonitResult } from "../model/monit_result"


export function gwParser(json: any): MonitResult[] {
	return json.data.list.map((station: any) => ({
		alias: station.stationname,
		pwr: station.pac,
		day: station.eday,
		stt: station.status === 1,
		invs: [] 
	}))
}