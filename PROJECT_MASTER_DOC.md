# 📘 Portfolio Project Master Documentation

이 문서는 프로젝트의 기획부터 개발, 마이그레이션, 디자인 시스템, 배포 인프라까지 모든 상세 내용을 기록한 마스터 문서입니다.

---

## 1. 📅 프로젝트 히스토리 (Project History)

### **Phase 1: 초기 개발 (Node.js + MongoDB)**
- **기간:** 2026-01-02 이전
- **스택:** React, Node.js (Express), MongoDB (Mongoose)
- **배포:** AWS EC2 (Ubuntu) + PM2 + Nginx
- **상태:** 기능 구현 완료 및 1차 배포 성공.

### **Phase 2: 대규모 마이그레이션 (Spring Boot + MySQL)**
- **기간:** 2026-01-02 ~ 2026-01-03
- **목표:** 시스템 안정성 확보, 확장성 고려, Java/Spring 생태계 전환
- **주요 작업:**
  - **Backend:** Express.js를 Spring Boot 3.2.1로 전면 재작성.
  - **Database:** NoSQL(MongoDB)에서 RDBMS(MySQL)로 스키마 변경.
  - **Frontend:** API 연동 로직 수정 및 데이터 타입(`_id` -> `id`) 대응 리팩토링.
  - **Infrastructure:** PM2 기반에서 Docker Container 기반으로 배포 방식 변경.

---

## 2. 🛠 기술 스택 (Tech Stack)

### **FrontEnd**
- **Core:** `React`, `TypeScript`, `Vite`
- **State Management:** `Recoil`, `React Query`
- **Styling:** `Tailwind CSS`, `styled-components`
- **Network:** `Axios`, `Socket.io-client`
- **Utils:** `Monaco Editor`, `JWT-decode`, `React-cookie`

### **BackEnd**
- **Framework:** `Spring Boot 3.2.1`
- **Language:** `Java 21`
- **Database:** `MySQL 8.0` (Prod), `H2` (Dev)
- **ORM:** `Spring Data JPA`
- **Security:** `Spring Security`, `JWT`
- **Build Tool:** `Gradle`
- **Docs:** `Swagger`, `Spring REST Docs`
- **Realtime:** `STOMP (WebSocket)`

### **Infrastructure**
- **Cloud:** `AWS EC2`, `AWS S3`
- **Container:** `Docker`, `Docker Compose`
- **CI/CD:** `Jenkins` (예정)
- **Web Server:** `Nginx`

---

## 3. 🎨 디자인 시스템 (Design System)

### **Color Palette (브랜드 컬러)**
| 색상명 | Hex Code | 설명 |
| :--- | :--- | :--- |
| **Brand Dark** | `#1F1F1F` | 메인 배경색 (Body Background) |
| **Brand Darker** | `#0E1A28` | 섹션 구분, 깊은 배경색 |
| **Brand Blue** | `#3545D6` | **메인 포인트 컬러**, 버튼, 강조 텍스트 |
| **Brand Blue Light** | `#5363EE` | 호버(Hover) 상태, 밝은 포인트 |
| **Brand Lime** | `#C2F750` | 서브 포인트, 아이콘 강조 |

### **Typography (타이포그래피)**
- **Font Family:** **Pretendard** (프리텐다드)
- **Weights:** Thin(100) ~ Black(900) 전체 지원
- **Base Style:**
  - 기본 텍스트 색상: `White (#FFFFFF)`
  - 기본 배경 색상: `Brand Dark (#1F1F1F)`

### **Tailwind Configuration**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'brand-dark': '#1F1F1F',
      'brand-darker': '#0E1A28',
      'brand-blue': '#3545D6',
      'brand-blue-light': '#5363EE',
      'brand-lime': '#C2F750',
    }
  }
}
```

---

## 4. 🔄 마이그레이션 상세 (Migration Details)

### **Database Schema Changes**
- **ID 체계 변경:**
  - MongoDB: `_id` (String, ObjectId)
  - MySQL: `id` (Long, Auto Increment)
- **주요 엔티티:**
  - `Project`: 포트폴리오 프로젝트 정보
  - `Skill`: 기술 스택 정보
  - `HomeData`: 메인 페이지 CMS 데이터 (프로필, 소개 등)
  - `VisitorLog`: 방문자 통계 로그

### **API Changes**
- **Port:** `5000` (Node.js) -> `8080` (Spring Boot)
- **Response Format:**
  - 차트 데이터(Recharts) 호환을 위해 `AdminController`에서 `Map<String, Object>` 형태로 데이터 가공하여 반환.

---

## 5. 🚢 배포 및 인프라 (Deployment)

### **Docker Configuration**
- **Backend:** `openjdk:21-jdk-slim` 기반 Dockerfile 생성.
- **Orchestration:** `docker-compose.yml`을 통해 MySQL과 Backend 컨테이너 통합 관리.

### **Nginx Configuration (Reverse Proxy)**
- **Static Files:** React 빌드 파일(`dist`) 서빙.
- **API Proxy:** `/api` 경로 요청을 `http://localhost:8080`으로 포워딩.

### **Current Status (2026-01-03)**
- ✅ **Local Development:** 완료 (Frontend + Backend 연동 확인)
- ✅ **Docker Setup:** 완료 (`Dockerfile`, `docker-compose.yml` 작성)
- ⏳ **Production Deployment:** 대기 중 (AWS EC2 배포 예정)

---

## 6. 📝 Next Steps
1. **GitHub Push:** 최신 코드 원격 저장소 반영.
2. **EC2 Environment Update:** Node.js 환경 제거 및 Docker 설치.
3. **Deploy:** `docker-compose up`으로 서비스 실행.
