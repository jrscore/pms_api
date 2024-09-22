// //발전소리스트
// // const list = [
// // 	{uid, corp, model, url, id, pwd }
// // 	{uid, corp, model, url, id, pwd }
// // 	{uid, corp, model, url, id, pwd }
// // 	{uid, corp, model, url, id, pwd }
// // ]

// // 타임테이블

// interface Monit {
// 	model: 	string	// 모니터링타입 cm, hd, octo, lsee, kaco, cube
// 	name:		string	// 발전소이름
// 	zone:		string	// 지역
// 	power:	number	// 발전소용량
// 	grid?:	number	// grid 값
// 	vcb?:		number	// vcb 값
// 	pv:		PV			// 발전소 계
// }

// interface PV {
// 	pwr:		number	// 현재출력
// 	day:		number	// 금일누적
// 	mth?:		number	// 금월누적
// 	year?:	number	// 금년누적
// 	yld:		number	//	총누적
// 	inv:		Inverter[]
// }

// interface Inverter {
// 	pwr:		number	// 현재출력
// 	day:		number	// 금일누적
// 	mth?:		number	// 금월누적
// 	year?:	number	// 금년누적
// 	yld:		number	//	총누적
// }




// //#### 크롤러 설계

// // 추상화 기반 구조 설계
// interface ICrawler {
//     login(): Promise<void>;
//     navigate(): Promise<void>;
//     scrapeData(): Promise<Monit>;
// }




// ///### 메인프로세스 설계

// // ICrawler 인터페이스는 앞서 정의된 대로입니다.

// // 크롤링 작업 커맨드
// class CrawlCommand {
//     constructor(private crawler: ICrawler) {}

//     execute() {
//         // 로그인, 페이지 이동, 크롤링 실행
//         this.crawler.login();
//         this.crawler.navigate();
//         this.crawler.scrapeData();
//     }
// }

// // 옵저버 인터페이스
// interface Observer {
//     update(crawlCommand: CrawlCommand): void;
// }

// // 크롤링 관리자 (싱글톤 + 옵저버)
// class CrawlerManager implements Observer {
//     private static instance: CrawlerManager;
//     private crawlCommands: CrawlCommand[] = [];

//     private constructor() {}

//     public static getInstance(): CrawlerManager {
//         if (!CrawlerManager.instance) {
//             CrawlerManager.instance = new CrawlerManager();
//         }
//         return CrawlerManager.instance;
//     }

//     update(crawlCommand: CrawlCommand) {
//         this.crawlCommands.push(crawlCommand);
//         crawlCommand.execute();
//     }

//     // 외부 요청에 의한 크롤링 시작 메서드
//     public startCrawlingOnDemand(crawlCommand: CrawlCommand) {
//         this.update(crawlCommand);
//     }

//     // 타임테이블에 따른 크롤링 스케줄링
//     public scheduleCrawling() {
//         // 타임테이블에 따라 CrawlCommand 생성 및 실행
//     }
// }

// // 사용 예
// const crawlerManager = CrawlerManager.getInstance();
// // 타임테이블에 따른 스케줄링 시작
// crawlerManager.scheduleCrawling();
// // 외부 요청 처리 예시
// crawlerManager.startCrawlingOnDemand(new CrawlCommand(new CmCrawler()));



// // ###### 크롤러인터페이스
// // 중간에 하나더 추가
// // pptr크롤러
// // axsCraw
// /*
// 전체 프로세스 요약:
// Node.js 설치 및 프로젝트 설정: 우분투 환경에서 Node.js를 설치하고, 프로젝트에 필요한 라이브러리(예: puppeteer, typescript, firebase)를 설정합니다.

// 크롤러 인터페이스 정의: ICrawler 인터페이스를 정의하여, 모든 크롤러가 공통적으로 준수해야 하는 메서드(login, navigate, scrapeData)를 명시합니다.

// 모델별 크롤링 프로세스 구현: 각 모델(발전소 웹사이트)별 크롤러 클래스를 구현하여, ICrawler 인터페이스를 구현합니다. 각 클래스는 모델별 로그인, 페이지 이동, 데이터 크롤링 로직을 포함합니다.

// 크롤링 관리자 및 커맨드 패턴 적용: CrawlerManager 클래스를 싱글톤으로 구현하여, 크롤링 작업을 중앙에서 관리합니다. 커맨드 패턴을 사용하여 크롤링 작업을 캡슐화하고, 옵저버 패턴을 통해 이벤트(타임테이블, 외부 요청 등)에 따라 크롤링 작업을 동적으로 실행합니다.

// 파이어베이스 업로드: 크롤링된 데이터는 파이어베이스(Firebase Firestore)에 업로드됩니다. 데이터 모델(Monit, PV, Inverter)에 따라 구조화된 데이터를 파이어베이스에 저장하는 로직을 구현합니다.

// 외부 인터페이스 및 확장성 고려: 시스템은 추후 확장을 고려하여, 클라우드 메시징 또는 외부 API 요청 등에 의해 크롤링을 시작할 수 있는 외부 인터페이스를 제공합니다.

// 이 구조를 통해, 다양한 발전소 웹사이트에서 크롤링된 데이터를 효율적으로 수집, 처리, 저장할 수 있으며, 시스템의 확장이나 새로운 모델의 추가가 용이합니다. 또한, 객체지향 설계 원칙과 디자인 패턴의 적용으로 코드의 가독성, 재사용성 및 유지보수성이 향상되었습니다.

// */