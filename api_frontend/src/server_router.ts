import express from "express"

// type
import { addCard, deleteCard, getCard } from "./usecase/card/card"
import { jwtMiddleware } from "./services/author"
import { modelCrawlling } from "./usecase/monit/model_crawlling"
import { managerCrawlling } from "./usecase/monit/mng_crawlling"
import { siteCrawlling } from "./usecase/monit/site_crawlling"

export const mntRouter 	= express.Router()
export const cardRouter = express.Router()
export const authRouter = express.Router()


//https://monit-service-dot-cdx-pms.du.r.appspot.com/mnt/model/octo?cid=DJFp5mQmPfEXQFZRyIc0
//  API.COREDEX.KR/mnt/xxx/xxxx ? cid=yyyy
mntRouter.get('/model/:model',	jwtMiddleware, modelCrawlling)
mntRouter.get('/mng/:model',		jwtMiddleware, managerCrawlling)
mntRouter.get('/site/:model',		jwtMiddleware, siteCrawlling)


mntRouter.post		('/config/model/',			jwtMiddleware, ()=>null )		
mntRouter.get			('/config/model/:mid',	jwtMiddleware, ()=>null )	
mntRouter.put			('/config/model/:mid',	jwtMiddleware, ()=>null )	
mntRouter.delete	('/config/model/:mid',	jwtMiddleware, ()=>null )	

mntRouter.post		('/config/site/',				jwtMiddleware, ()=>null )	
mntRouter.get			('/config/site/:sid',		jwtMiddleware, ()=>null )	
mntRouter.put			('/config/site/:sid',		jwtMiddleware, ()=>null )	
mntRouter.delete	('/config/site/:sid',		jwtMiddleware, ()=>null )	


// CARRD
// cardRouter.get		('/card/:cid',		jwtMiddleware, getCard )
// cardRouter.post		('/card',					jwtMiddleware, addCard )
// cardRouter.delete	('/card/:id', 		jwtMiddleware, deleteCard )
