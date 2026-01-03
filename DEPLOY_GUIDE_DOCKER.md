# Spring Boot + MySQL + Docker 배포 가이드

이 가이드는 AWS EC2 인스턴스에 Docker를 사용하여 프로젝트를 배포하는 방법을 설명합니다.

## 1. EC2 인스턴스 준비 (Ubuntu 22.04 LTS 권장)

### 1-1. 시스템 업데이트 및 Docker 설치
EC2에 SSH로 접속한 후 다음 명령어를 실행합니다.

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 실행)
sudo usermod -aG docker $USER
# (로그아웃 후 다시 로그인해야 적용됨)
exit
```

### 1-2. Docker Compose 설치
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## 2. 프로젝트 배포

### 2-1. 프로젝트 코드 가져오기
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <PROJECT_DIRECTORY>
```

### 2-2. 백엔드 빌드 (EC2 내부에서 빌드하는 경우)
Java 21이 설치되어 있지 않다면 Docker를 이용해 빌드하거나, JDK를 설치해야 합니다.
여기서는 JDK 설치 후 빌드하는 방법을 안내합니다.

```bash
# Java 21 설치
sudo apt install -y openjdk-21-jdk

# 백엔드 빌드
cd backend
chmod +x gradlew
./gradlew clean build -x test
cd ..
```

### 2-3. Docker Compose 실행
루트 디렉토리(docker-compose.yml이 있는 곳)에서 실행합니다.

```bash
docker-compose up -d --build
```

## 3. 프론트엔드 배포 (Nginx 사용)
프론트엔드는 Docker 컨테이너로 띄우거나, EC2에 Nginx를 직접 설치하여 호스팅할 수 있습니다.
여기서는 Nginx를 직접 설치하여 빌드된 정적 파일을 서빙하는 방법을 권장합니다.

### 3-1. Node.js 설치 및 빌드
```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 의존성 설치 및 빌드
npm install
npm run build
```

### 3-2. Nginx 설치 및 설정
```bash
sudo apt install -y nginx
```

Nginx 설정 파일 수정:
```bash
sudo nano /etc/nginx/sites-available/default
```

다음 내용으로 교체 (도메인이 있다면 server_name 수정):
```nginx
server {
    listen 80;
    server_name _;

    root /home/ubuntu/<PROJECT_DIRECTORY>/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Nginx 재시작:
```bash
sudo systemctl restart nginx
```

## 4. 확인
브라우저에서 EC2의 퍼블릭 IP로 접속하여 사이트가 정상적으로 뜨는지 확인합니다.
