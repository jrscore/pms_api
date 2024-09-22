import { ObBot } from './ob'
import { IGrid } from '../model/grid'
import { OctoBot } from './octo'
import { ISiteInfo } from '../model/monit_model'
import { HdBot } from './hd'
import { LaseeBot } from './lasi'
import { CmBot } from './cm'
import { HexBot } from './hex'
import { DassBot } from './dass'
import { EnsearchBot } from './en'
import { EcoBot } from './eco'
import { MrtBot } from './_mrt'
import { RemsBot } from './rems'


export interface Bot {
	initialize(cid:string): Promise<void>
  crawlling(): Promise<IGrid[]>
}


export class BotFactory {
	static getBot(model: string): Bot {
		switch (model) {
			case 'octo':	return new OctoBot()
			case 'hd':		return new HdBot()
			case 'cm':		return new CmBot()
			case 'dass':	return new DassBot()
			case 'eco':		return new EcoBot()
			case 'rems':	return new RemsBot()
			case 'en':		return new EnsearchBot()
			// case 'mrt':		return new MrtBot()
			// case 'hex':		return new HexBot(cid)
			// case 'gw':		return new GwBot()
			// case 'ob':		return new ObBot(cid)
			// case 'ls':		return new LaseeBot()
			default: 			throw new Error(`봇 생성 실패: ${model}`)
		}
	}
}