# AWS EC2 배포 가이드

이 가이드는 AWS EC2(Ubuntu) 인스턴스에 포트폴리오 프로젝트를 배포하는 방법을 설명합니다.

## 1. EC2 인스턴스 생성
1. AWS 콘솔에서 **EC2** 서비스로 이동합니다.
2. **인스턴스 시작**을 클릭합니다.
3. **이름**: `Portfolio-Server` (원하는 이름)
4. **OS 이미지**: `Ubuntu Server 22.04 LTS` (또는 20.04)
5. **인스턴스 유형**: `t2.micro` (프리티어 가능)
6. **키 페어**: 새 키 페어를 생성하고 다운로드(.pem) 합니다.
7. **네트워크 설정**:
   - '인터넷에서 HTTP 트래픽 허용' 체크
   - '인터넷에서 HTTPS 트래픽 허용' 체크
8. **인스턴스 시작** 클릭.

## 2. 탄력적 IP (Elastic IP) 연결 (선택 사항)
서버를 재시작해도 IP가 바뀌지 않게 하려면 탄력적 IP를 할당받아 인스턴스에 연결하세요.

## 3. 서버 접속 (SSH)
터미널(PowerShell 또는 Git Bash)을 열고 키 파일이 있는 폴더로 이동하여 접속합니다.
```bash
ssh -i "키파일이름.pem" ubuntu@<EC2-퍼블릭-IP>
```

## 4. 기본 환경 설정 (EC2 내부에서 실행)
접속한 EC2 터미널에서 다음 명령어들을 순서대로 입력합니다.

### 4-1. 시스템 업데이트 및 필수 프로그램 설치
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl
```

### 4-2. Node.js 설치 (버전 20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4-3. PM2 설치 (서버 무중단 실행 도구)
```bash
sudo npm install -g pm2
```

## 5. 프로젝트 다운로드 및 설정

### 5-1. 프로젝트 클론
GitHub에 코드를 올렸다면 clone을, 아니라면 파일 전송 도구(FileZilla 등)를 사용해 파일을 업로드하세요.
```bash
git clone <GITHUB_REPO_URL>
cd <프로젝트폴더명>
```

### 5-2. 의존성 설치 및 빌드
```bash
# 라이브러리 설치
npm install

# 프론트엔드 빌드 (React -> HTML/CSS/JS 변환)
npm run build
```

### 5-3. 환경 변수 설정
`.env` 파일을 생성하고 내용을 입력합니다.
```bash
nano .env
```
아래 내용을 붙여넣고 (우클릭), `Ctrl+O` (저장), `Enter`, `Ctrl+X` (종료)를 누릅니다.
```env
PORT=80
MONGODB_URI=<MongoDB_Atlas_접속_주소>
JWT_SECRET=내_비밀_키
ADMIN_PASSWORD=admin1234
```
*주의: `PORT=80`으로 설정해야 IP 주소만 입력했을 때 바로 접속됩니다.*

## 6. 서버 실행 (포트 권한 문제 해결)
리눅스에서 80번 포트(기본 웹 포트)를 사용하려면 root 권한이 필요하거나 권한을 부여해야 합니다.

### 방법 A: authbind 사용 (추천)
```bash
sudo apt install authbind
sudo touch /etc/authbind/byport/80
sudo chmod 500 /etc/authbind/byport/80
sudo chown ubuntu /etc/authbind/byport/80
```
그리고 `package.json`의 start 스크립트를 `authbind --deep node server/index.js`로 수정하거나, PM2를 사용합니다.

### 방법 B: PM2로 실행 (가장 간편)
이미 프로젝트 루트에 `ecosystem.config.js`를 만들어 두었습니다.
```bash
# 80번 포트 사용 권한 부여
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# 서버 시작
pm2 start ecosystem.config.js
```

## 7. 배포 확인
브라우저 주소창에 `http://<EC2-퍼블릭-IP>`를 입력하여 접속되는지 확인합니다.

## 8. (선택) MongoDB 설치
MongoDB Atlas(클라우드)를 쓰지 않고 EC2에 직접 DB를 설치하려면:
```bash
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```
이 경우 `.env`의 `MONGODB_URI`는 `mongodb://localhost:27017/portfolio`가 됩니다.
