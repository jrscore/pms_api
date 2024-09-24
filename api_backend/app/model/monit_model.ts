
export interface SiteInfo {
	cid: 		string		// 업체 아이디
	alias:	string		// 발전소 명칭
	code: 	string		// 발전소 코드
	id: 		string
	pwd: 		string
	memo:		string | { [key: string]: any }
	model:	string
}


export interface MonitModel {
	model:	string		// octo, hd, cm....
	url:		string		// 모니터링 모델 주소
	idtg:		string		// playwrite에서 사용할 id tag
	pwdtg:	string		// playwrite에서 사용할 password tag
	login:	string		// playwrite에서 사용할 login tag
	logout:	string		// playwrite에서 사용할 logout tag
}