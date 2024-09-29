import { GridData } from '../model/grid'
import { HdBot } from './hd'
import { CmBot } from './cm'
import { DassBot } from './dass'
import { EcoBot } from './eco'
import { EnsearchBot } from './en'
import { OctoBot } from './octo'
import { RemsBot } from './rems'
import { HexBot } from './hex'
import { LaseeBot } from './lasi'


export interface Bot {
	initialize(cid:string): Promise<void>
  crawlling(): Promise<GridData[]>
}


export class BotFactory {
	static getBot(model: string): Bot {
		switch (model) {
			case 'cm':			return new CmBot()
			case 'dass':		return new DassBot()
			case 'eco':			return new EcoBot()
			case 'en':			return new EnsearchBot()
			case 'octo':		return new OctoBot()
			case 'rems':		return new RemsBot()
			case 'hd':			return new HdBot()
			case 'lasee':		return new LaseeBot()
			case 'hex':			return new HexBot()

			// case 'mrt':	return new MrtBot()
			// case 'gw':		return new GwBot()
			default: 			throw new Error(`봇 생성 실패: ${model}`)
		}
	}
}