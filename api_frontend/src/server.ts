import { errorHandler } from "./server_error"
import express from "express"
import cors from 'cors'
import { authRouter, cardRouter, mntRouter } from "./server_router"


// # HTTPS	: App Engine
// # 환경변수	: App Engine 			app.yaml
// # Secret : Cloud Secret		gcloud secrets versions add my-secret --data-file="path/to/secret.txt"
// # Access	: IAM							gcloud projects add-iam-policy-binding [PROJECT_ID] \
// # DDOS		: Cloud Armor
// # 방화벽	 : App Engine			 gcloud app firewall-rules create 1000 --action allow --source-range 203.0.113.0/24 --description "Allow traffic from example IP range"


// # 모니터링 후 FCM 모바일발송


// .env => 현재폴더 .env읽어들여
import dotenv from "dotenv";



const app = express()

const port   = process.env.PORT || 3000
const secret = process.env.SECRET_KEY							// 추후구현

const corsOrigin = process.env.NODE_ENV === "dev" ? ["http://localhost:3000"] : [""]
app.use(cors({ origin: corsOrigin }))							// app.use(cors({ credentials: true, origin: corsOrigin }))

app.use(express.json())														// Content-Type이 "application/json"인 요청에서 req.body에 접근
app.use(express.urlencoded({ extended: true }))		// 요청본문 Json 파싱
app.use(errorHandler)


app.use('/mnt',  mntRouter)
app.use('/card', cardRouter)
app.use('/auth', authRouter)



app.listen(port, () => console.log(`서버실행 http://localhost:${port}`) )