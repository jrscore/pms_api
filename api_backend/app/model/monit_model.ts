
export interface SiteInfo {
	cid: 		string
	alias:	string
	code: 	string
	id: 		string
	pwd: 		string
	memo:		string | { [key: string]: any }
	model:	string
}


export interface MonitModel {
	model:	string
	url:		string
	idtg:		string
	pwdtg:	string
	login:	string
	logout:	string
}