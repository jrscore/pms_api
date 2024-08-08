/**
curl -X POST https://<YOUR_FIREBASE_FUNCTIONS_URL>/addCardTransaction \
	-H "Content-Type: application/json" \
	-d '{"sms": "카드번호: 1234-5678-9876-5432, 사용일시: 2023-06-16 12:34:56, 사용금액: 10000원"}'
*/

import { Request, Response } from "express"
import { makeResponse } from "../../entity/helper"
import { CardDao } from "../../entity/card"
import { CardRepository } from "../../repository/r_card"


const repo = new CardRepository()


export const addCard = async (req: Request, res: Response) => {

	const { issuer, cdno, date, store, amount } = req.body
	const newCard = new CardDao(issuer, cdno, new Date(date), store, amount)

	try {
		const id = await repo.addnew(newCard)
		res.status(201).json( makeResponse(true, 'Success', { id }))
	} catch (error) {
		res.status(500).json( makeResponse(false, 'EntityErr'))
	}
}


export const getCard = async (req: Request, res: Response) => {
	const { id } = req.params

	try {
		const card = await repo.get(id)
		if (card) {
			res.status(200).json(makeResponse(true, 'Success', card))
		} else {
			res.status(404).json(makeResponse(false, 'Card not found'))
		}
	} catch (error) {
		res.status(500).json(makeResponse(false, 'EntityErr'))
	}
}


export const deleteCard = async (req: Request, res: Response) => {
	const { id } = req.params

	try {
		await repo.delete(id)
		res.status(200).json(makeResponse(true, 'Success'))
	} catch (error) {
		res.status(500).json(makeResponse(false, 'EntityErr'))
	}
}


export const updateCard = async (req: Request, res: Response) => {
	const { id } = req.params
	const { issuer, cdno, date, store, amount } = req.body
	const updatedCard = new CardDao(issuer, cdno, new Date(date), store, amount)

	try {
		await repo.update(id, updatedCard)
		res.status(200).json(makeResponse(true, 'Success'))
	} catch (error) {
		res.status(500).json(makeResponse(false, 'EntityErr'))
	}
}


