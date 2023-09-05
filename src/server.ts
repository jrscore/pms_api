import express from 'express';
import database from './repository/database';

import monitRouter from './mnt/monit/router';
import aeonRouter from './mnt/aeon/router';
import cors from 'cors';
import dotenv from 'dotenv'

/*
	api.coredex.kr/mnt/
	api.coredex.kr/mnt/aeon/
*/

// .env나 .env.development 중 적절한 파일을 사용하기 위한 경로 설정
const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envPath });


const PORT = process.env.port || 3000;  // 3000은 default 값
const app = express();


app.use(cors());
app.use('/mnt', monitRouter);
app.use('/mnt/aeon', aeonRouter);

database.connect();


//app.listen(PORT, callback)의 기본 동작은 0.0.0.0 (모든 네트워크 인터페이스)에서 주어진 포트를 리스닝합니다. 이것은 무슨 뜻일까요? 이는 서버가 현재 시스템에서 실행되는 모든 IP 주소에 대해 연결을 수신하겠다는 뜻입니다.
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});