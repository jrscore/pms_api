import { GridData } from '../model/grid'
import { HdBot } from './hd'
import { CmBot } from './cm'
import { DassBot } from './dass'
import { RemsBot } from './rems'
import { EcoBot } from './eco'
import { EnsearchBot } from './en'
import { OctoBot } from './octo'


export interface Bot {
	initialize(cid:string): Promise<void>
  crawlling(): Promise<GridData[]>
}


export class BotFactory {
	static getBot(model: string): Bot {
		switch (model) {
			case 'cm':		return new CmBot()
			case 'dass':	return new DassBot()
			case 'eco':		return new EcoBot()
			case 'en':		return new EnsearchBot()
			case 'octo':	return new OctoBot()

			case 'rems':	return new RemsBot()
			case 'hd':		return new HdBot()
			// case 'mrt':		return new MrtBot()
			// case 'hex':		return new HexBot(cid)
			// case 'gw':		return new GwBot()
			// case 'ob':		return new ObBot(cid)
			// case 'ls':		return new LaseeBot()
			default: 			throw new Error(`봇 생성 실패: ${model}`)
		}
	}
}