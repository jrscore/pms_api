import { ObBot } from './ob'
import { IGrid } from '../model/grid'
import { OctoBot } from './octo'
import { ISiteInfo } from '../model/monit_model'
import { HdBot } from './hd'
import { LaseeBot } from './lasi'
import { CmBot } from './cm'
import { GwBot } from './gw'
import { HexBot } from './hex'


export interface Bot {
	initialize(cid:string): Promise<void>
  crawlling(): Promise<IGrid[]>
}


export class BotFactory {
	static getBot(model: string): Bot {
		switch (model) {
			case 'octo':	return new OctoBot()
			// case 'hd':		return new HdBot(cid)
			// case 'ls':		return new LaseeBot(cid)
			// case 'cm':		return new CmBot(cid)
			
			// case 'ob':		return new ObBot(cid)
			// case 'gw':		return new GwBot(cid)
			// case 'hex':		return new HexBot(cid)
			default: 			throw new Error(`봇 생성에 실패하였습니다: ${model}`)
		}
	}
}