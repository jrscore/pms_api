
export type ApiResponse<T> = {
  meta:		{ ok: boolean, type?: string }
  message:{ message: string }
  data?: 	T
}

export type ApiError = ApiResponse<{}>

