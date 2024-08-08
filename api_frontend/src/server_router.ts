import express from "express"

// type
import { addCard, deleteCard, getCard } from "./usecase/card/card"
import { jwtMiddleware } from "./services/author"
import { getByModel } from "./usecase/monit/get_by_model"
import { getByManager } from "./usecase/monit/get_by_manager"
import { getBySite } from "./usecase/monit/get_by_site"

export const mntRouter 	= express.Router()
export const cardRouter = express.Router()
export const authRouter = express.Router()



//  API.COREDEX.KR/mnt/xxx/xxxx ? cid=yyyy
mntRouter.get('/model/:model',	jwtMiddleware, getByModel)
mntRouter.get('/mng/:model',		jwtMiddleware, getByManager)
mntRouter.get('/site/:model',		jwtMiddleware, getBySite)


// MONIT_MODEL CRUD
mntRouter.post		('/mng/model/', 		jwtMiddleware, ()=>null )	
mntRouter.get			('/mng/model/:mid', jwtMiddleware, ()=>null )	
mntRouter.put			('/mng/model/:mid', jwtMiddleware, ()=>null )	
mntRouter.delete	('/mng/model/:mid', jwtMiddleware, ()=>null )	


// SITE_INFO CRUD
mntRouter.post		('/mng/info/', 			jwtMiddleware, ()=>null )	
mntRouter.get			('/mng/info/:sid',	jwtMiddleware, ()=>null )	
mntRouter.put			('/mng/info/:sid',	jwtMiddleware, ()=>null )	
mntRouter.delete	('/mng/info/:sid',	jwtMiddleware, ()=>null )	


// CARRD
cardRouter.get		('/card/:cid',		jwtMiddleware, getCard )
cardRouter.post		('/card',					jwtMiddleware, addCard )
cardRouter.delete	('/card/:id', 		jwtMiddleware, deleteCard )
