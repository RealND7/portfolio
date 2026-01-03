# 🚀 Next Session Action Plan

**돌아오시면 이 순서대로 바로 시작하면 됩니다!**

## 1. 코드 저장 (Local -> GitHub)
가장 먼저 로컬의 변경사항을 저장소에 올려야 합니다.
```bash
git add .
git commit -m "Refactor: Migrate to Spring Boot & MySQL, Add Docker config"
git push origin main
```

## 2. 서버 접속 (AWS EC2)
터미널을 열고 EC2에 접속합니다.
```bash
ssh -i "키파일이름.pem" ubuntu@<EC2-퍼블릭-IP>
```

## 3. 배포 진행 (Docker)
EC2 내부에서 다음 명령어를 실행하여 배포합니다. (상세: `DEPLOY_GUIDE_DOCKER.md`)
```bash
# 1. 기존 프로세스 정리 (Node.js/PM2 중지)
pm2 stop all
pm2 delete all

# 2. 최신 코드 받기
cd 포토폴리오
git pull origin main

# 3. Docker 실행 (백엔드 + DB)
docker-compose up -d --build
```

## 4. 프론트엔드 배포
```bash
# Nginx 설정 및 정적 파일 빌드 (상세 가이드 참고)
```

---
**참고 문서:**
- `PROJECT_MASTER_DOC.md`: 프로젝트 전체 개요
- `DEPLOY_GUIDE_DOCKER.md`: 배포 상세 가이드
- `WORK_LOG_20260103.md`: 지난 작업 내역
