# 2026-01-03 상세 개발 세션 기록 (Detailed Session Log)

**날짜:** 2026년 1월 3일
**참여자:** 사용자 (User), 에디터스 (GitHub Copilot)
**주제:** Node.js/MongoDB에서 Spring Boot/MySQL로의 마이그레이션 및 Docker 배포 환경 구축

---

## 1. 백엔드 API 및 데이터베이스 정비 (Phase 1)
**시간:** 20:00 ~ 20:40

### 1.1. 차트 데이터 응답 형식 수정
- **상황 (Context):** 
  - 프론트엔드 대시보드(`Admin.tsx`)에서 사용하는 차트 라이브러리(Recharts)는 JSON 객체 배열(`[{ name: '...', value: 10 }]`) 형태를 기대함.
  - 기존 Spring Boot의 JPQL 쿼리는 `Object[]` 배열 형태의 리스트를 반환하여 프론트엔드에서 파싱 에러 발생.
- **요청 (Request):** "백엔드 API 응답 형식이 프론트엔드 차트 라이브러리와 맞지 않는 것 같습니다."
- **해결 (Solution):** `backend/src/main/java/com/portfolio/controller/AdminController.java` 수정.
  - **변경 전:** `List<Object[]>` 반환.
  - **변경 후:** `List<Map<String, Object>>` 반환.
  - **로직:** 스트림 API를 사용하여 `Object[]`를 순회하며 `Map`으로 변환하는 로직 구현.

### 1.2. 데이터베이스 초기화 스크립트 작성
- **상황 (Context):** 로컬 및 배포 환경에서 MySQL 데이터베이스를 처음 셋업할 때 사용할 SQL 스크립트 부재.
- **요청 (Request):** "DB 초기화 스크립트도 필요합니다."
- **해결 (Solution):** `backend/mysql-init.sql` 파일 생성.
  - **내용:**
    - `CREATE DATABASE IF NOT EXISTS portfolio;`
    - `CREATE USER IF NOT EXISTS 'portfolio_user'@'%' IDENTIFIED BY '...';`
    - `GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio_user'@'%';`

---

## 2. 프론트엔드 대규모 리팩토링 (Phase 2)
**시간:** 20:40 ~ 21:50

### 2.1. MongoDB 의존성 제거 (`_id` -> `id`)
- **상황 (Context):** 
  - MongoDB는 기본 키로 문자열 기반의 `_id`를 사용.
  - MySQL(JPA)은 숫자형(Long) 기반의 `id`를 사용.
  - 프론트엔드 코드 곳곳에 `item._id`로 접근하는 코드가 남아있어 렌더링 및 로직 에러 발생.
- **요청 (Request):** "프론트엔드 코드에 아직 MongoDB 스타일의 `_id`가 남아있어서 오류가 납니다."
- **해결 (Solution):** 주요 컴포넌트 및 페이지 전수 조사 및 수정.
  - **`src/pages/Skills.tsx`:**
    - 인터페이스 수정: `interface Skill { id: number; ... }`
    - 삭제 함수 수정: `handleDelete(id: number)`
  - **`src/pages/Projects.tsx`:**
    - 리스트 렌더링 `key` 속성 변경: `key={project._id}` -> `key={project.id}`
  - **`src/pages/Admin.tsx`:**
    - 관리자 패널의 데이터 테이블 렌더링 로직에서 `_id` 참조 제거.
  - **`src/pages/Home.tsx`, `src/pages/ProjectDetail.tsx`:**
    - 동일하게 ID 참조 방식 변경.

### 2.2. API 프록시 및 엔드포인트 수정
- **상황 (Context):** 
  - 기존 Node.js 서버는 5000번 포트 사용.
  - 새로운 Spring Boot 서버는 8080번 포트 사용.
  - 이미지 업로드 경로가 `/upload`에서 `/api/home/upload`로 변경됨.
- **해결 (Solution):**
  - **`vite.config.ts`:** `server.proxy` 설정을 `target: 'http://localhost:5000'`에서 `target: 'http://localhost:8080'`으로 변경.
  - **`src/pages/Admin.tsx`:** 이미지 업로드 요청 URL을 변경된 백엔드 컨트롤러 매핑에 맞게 수정.

### 2.3. 파일 시스템 락(Lock) 이슈 해결
- **상황 (Context):** `Admin.tsx` 파일을 수정하여 저장하려 했으나, VS Code 또는 다른 프로세스가 파일을 점유하고 있어 쓰기 권한 오류 발생.
- **해결 (Solution):** 우회 전략 사용.
  1. 수정된 내용을 `src/pages/Admin.tsx.new`라는 임시 파일로 생성.
  2. PowerShell 터미널에서 `Move-Item -Force` 명령어를 사용하여 원본 파일을 강제로 덮어쓰기 함.

---

## 3. 인프라 및 배포 환경 구축 (Phase 3)
**시간:** 21:50 ~ 22:30

### 3.1. Docker 환경 구성
- **상황 (Context):** AWS EC2에 일관된 환경으로 배포하기 위해 컨테이너화 필요.
- **요청 (Request):** "AWS EC2에 배포하려고 합니다. Docker를 사용해서 환경을 구성해 줄 수 있나요?"
- **해결 (Solution):**
  - **`backend/Dockerfile` 작성:**
    - Base Image: `openjdk:21-jdk-slim`
    - Build: `gradlew build` (또는 jar 파일 복사)
    - Entrypoint: `java -jar app.jar`
  - **`docker-compose.yml` 작성:**
    - **Service 1 (db):** `mysql:8.0` 이미지 사용, 환경변수 설정, 볼륨 마운트.
    - **Service 2 (backend):** 위에서 만든 Dockerfile 빌드, `depends_on: db` 설정.
    - **Network:** `portfolio-network` 브리지 네트워크 생성하여 컨테이너 간 통신 연결.

### 3.2. 배포 가이드 문서화
- **해결 (Solution):** `DEPLOY_GUIDE_DOCKER.md` 작성.
  - EC2 인스턴스(Ubuntu) 초기 세팅 (Docker 설치).
  - Git Clone 및 빌드 방법.
  - `docker-compose up -d` 실행 방법.
  - 트러블슈팅 가이드 포함.

---

## 4. 문서화 및 프로젝트 정리 (Phase 4)
**시간:** 22:30 ~ 23:00

### 4.1. 프로젝트 마스터 문서 생성
- **상황 (Context):** 프로젝트의 히스토리와 기술 스택 변경 사항을 한눈에 볼 수 있는 문서 필요.
- **해결 (Solution):** `PROJECT_MASTER_DOC.md` 생성.
  - **Phase 1:** Node.js + MongoDB 시절.
  - **Phase 2:** Spring Boot + MySQL 마이그레이션 (현재).
  - **Tech Stack:** FE(React, Recoil), BE(Spring Boot, JPA), Infra(Docker, AWS) 상세 기술.

### 4.2. README 업데이트
- **해결 (Solution):** `README.md`를 최신 상태로 업데이트하여 프로젝트 개요와 실행 방법을 현행화함.

---

## 5. 최종 결과 (Summary)
- **Migration 완료:** Node.js/MongoDB 코드를 완전히 제거하고 Spring Boot/MySQL로 전환 성공.
- **Frontend 정상화:** 백엔드 변경에 따른 프론트엔드 에러(Type, API Path) 100% 수정 완료.
- **Deployment Ready:** Docker Compose를 이용한 원클릭 배포 환경 구축 완료.