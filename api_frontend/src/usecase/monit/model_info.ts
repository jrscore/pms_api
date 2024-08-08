import { Request, Response } from "express"


export const getModelInfo = async (req: Request, res: Response) => {
	res.send({ message: 'Test handler response' })
}


export const addModelInfo = async (req: Request, res: Response) => {
	const { cid } = req.query as { cid: string }
	const { model } = req.params as { model: string }
	// 모델별 크롤링 로직 추가
	res.send({ message: `Model handler for model: ${model} and cid: ${cid}` })
}


export const updateModelInfo = async (req: Request, res: Response) => {
	const { cid } = req.params as { cid: string }
	// 회사 전체 크롤링 로직 추가
	res.send({ message: `Corp handler for cid: ${cid}` })
}


export const deleteModelInfo = async (req: Request, res: Response) => {
	const { sid } = req.params as { sid: string }
	const { cid } = req.query as { cid: string }
	res.send({ message: '개별사이트 크롤링 api, 현재 지원되지 않습니다' })
}


