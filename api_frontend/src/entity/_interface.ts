
//공통인터페이스
export interface IParam { id?: string }
export interface IQuery { query?: string }
export interface IBody  { data?: any }
export interface IParameter { Params: IParam, Querystring: IQuery, Body: IBody }
