# 빌드 스테이지
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 런타임 스테이지
FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache tzdata

# 프로덕션 의존성 설치
COPY package*.json ./
RUN npm install --production

# 빌드 결과물 복사
COPY --from=build /usr/src/app/dist ./dist

# PM2 설치
RUN npm install pm2 -g

# PM2 설정 파일 복사
COPY ecosystem.config.js ./

# 애플리케이션 실행
CMD ["pm2-runtime", "ecosystem.config.js"]