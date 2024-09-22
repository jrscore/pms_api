# justify 변경
# kesco 구현
# keea 구현
# kepco 구현


# APP ENGINE
	- appengine, pubsub예제 : https://cloud.google.com/appengine/docs/standard/writing-and-responding-to-pub-sub-messages?hl=ko&tab=node.js
	- instances <- versions <- services <- project 구조
	- https://PROJECT.REGION.r.appspot.com
	- 확장유형 : 자동,기본,수동

# DEPLOY
	- 필수: app.yaml, package.json, package.lock.json, npm run start 명령어
	- gcloud app deploy => CloudStorage 업로드  ->  CloudBuild  실행  ->  AppEngine  배포
	- .gcloud ignore
	- 버전지정: gcloud app deploy --version v1

