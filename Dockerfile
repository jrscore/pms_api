# 베이스 이미지
FROM node:18-alpine3.17

# timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 패키지복사 및 설치
WORKDIR		 /app
COPY			 package.json package-lock.json ./
RUN			 npm ci && \
   			 npm install pm2 -g

# 소스코드 복사
COPY	 ./dist /app/dist

EXPOSE 8000

# 실행
CMD ["sh", "-c", "NODE_ENV=production pm2-runtime start ./dist/server.js"]
