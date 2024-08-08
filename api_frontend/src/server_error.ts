// ##### handler.ts #####

// type
import { AxiosError } from "axios"
import { ApiError } from "./entity/types"
import type { ErrorRequestHandler, Response } from "express"

/**
 * 에러 처리 핸들러
 * 에러 발생 시 해당 핸들러(미들웨어)로 에러가 들어옴
 * 
 * ex) 특정 라우터에서 "next(error)"을 사용하면 해당 핸들러의 첫 번째 인자로 error가 그대로 들어옴
 * 따라서 해당 error에 맞게 적절한 응답을 해주면 됨
 * 
 * @param err 에러 객체
 * @param req "express"의 request
 * @param res "express"의 response
 * @param next "express"의 next
 */
export const errorHandler: ErrorRequestHandler = ( err, req, res: Response<ApiError>, next) => {

  if (err instanceof AxiosError) {
    console.error("axios 에러 >> ", err)
    res.status(500).json({
      meta: 	{ ok: false, type: "axios" },
      message:{ message: "API측 문제입니다.\n잠시후에 다시 시도해주세요!" },
    })
  } else {
    console.error("알 수 없는 에러 >> ", err)
    res.status(500).json({
      meta: 	{ ok: false, type: "unknown" },
      message:{ message: '서버 문제가 발생하였습니다'},
    })
  }

}