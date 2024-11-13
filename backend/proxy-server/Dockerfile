# 베이스 이미지 설정
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# NODE_ENV 설정 (프로덕션 모드)
ENV NODE_ENV=production

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 프로덕션 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# PM2 설치
RUN npm install pm2 -g

# PM2 설정 파일 복사 (옵션)
COPY ecosystem.config.js ./

# PM2로 앱 실행
CMD ["pm2-runtime", "ecosystem.config.js"]