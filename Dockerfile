# Node.js 기반 이미지 사용
FROM node:20.11.1

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 'serve'를 글로벌로 설치
RUN npm install -g serve

# 나머지 애플리케이션 파일 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 애플리케이션이 사용하는 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령어 설정
CMD ["serve", "-s", "build"]