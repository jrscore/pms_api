import { ApiResponse } from "./types"

export const makeResponse = <T>(ok: boolean, message: string, data?: T, type: string = 'unknown'): ApiResponse<T> => {
  return {
    meta: { ok, type },
    message: { message },
    data,
  }
}