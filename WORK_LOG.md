# 📅 개발 작업 일지 (Work Log)

## 2025-12-31 (Day 1)

### 📝 기획 및 디자인 (Phase 0)
- **프로젝트 목표:** 프론트엔드 개발자로서의 성장을 보여주는 포트폴리오 웹사이트 구축.
- **컨셉:** 다크 & 모던 (Dark & Modern) + 인터랙티브 요소 (Framer Motion).
- **스토리텔링:** 기획자(Planner)에서 개발자(Developer)로 성장하는 과정을 강조.
  - **Projects 섹션:** 기획자로서의 역량 강조 (역할/Role 표기), 16:9 이미지 슬라이드 방식.
  - **Skills 섹션:** 개발자로서의 역량 강조, **Monaco Editor**를 활용해 실제 코드를 보여주고 실행 결과 확인 가능하게 구현.
- **반응형 전략:**
  - PC: 에디터와 미리보기 화면 분할.
  - Mobile: 탭(Tab) 버튼을 통해 에디터/미리보기 전환.
- **라우팅 구조:**
  - 사용자(Public): **원 페이지 스크롤 (One Page Scroll)** 방식.
  - 관리자(Admin): `/admin` 경로로 분리 (프로젝트 및 기술 스택 데이터 관리).

### ⚙️ 개발 환경 설정 (Phase 1)
- **기술 스택 확정:**
  - Core: React, TypeScript, Vite
  - Styling: Tailwind CSS
  - Animation: Framer Motion
  - Editor: Monaco Editor (@monaco-editor/react)
  - State/Data: React Query (TanStack Query)
- **프로젝트 생성:** `npm create vite@latest . -- --template react-ts` 완료.
- **폴더 구조 생성:**
  ```
  src/
  ├── components/ (common, layout)
  ├── pages/
  ├── hooks/
  ├── services/
  ├── store/
  ├── styles/
  ├── types/
  └── utils/
  ```

### ✅ 진행 상황
- **로드맵:** 총 200단계 중 **1~13단계 완료**.
- **다음 작업:** Git 초기화, Tailwind CSS 설치 및 설정부터 시작 예정.

---
*작성자: 에디터스 (GitHub Copilot)*
