// src/services/secretManagerService.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { Request, Response, NextFunction } from 'express'
import { auth } from './admin';


//# Authen : 인증	=> oauth2
//# Author : 권한	=> jwt	(header.payload.signature) 
//#									- rshToken => db, 강제로그아웃 
//#									- accToken


export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	console.log('Authorization => TOKEN')
	
	// const author = req.headers.authorization

	// if (author) {
	// 	const token = author.split(' ')[1]
	// 	try {
	// 		const decoded = await auth.verifyIdToken(token)
	// 		console.error('jwt허가토큰 => ', decoded )
	// 		// req.user = decoded
	// 		next()
	// 	} catch (error) {
	// 		console.error('허가거부', error)
	// 		res.sendStatus(403)
	// 	}
	// } else {
	// 	console.error('미인증')
	// 	res.sendStatus(401)
	// }

	next()
}
