# VESTI 프로젝트 진행 로그

> 마지막 업데이트: 2026-08-10

## 1. 프로젝트 개요

- 프로젝트명: VESTI
- 목적: 개인 옷장 관리 및 코디 기록을 기반으로 한 AI 코디 추천 서비스
- Backend: Java 21, Spring Boot
- Security: Spring Security + JWT
- ORM: Spring Data JPA
- Database: PostgreSQL (Supabase)
- API 문서: Swagger / OpenAPI
- Build Tool: Gradle

---

## 2. 현재 구현 완료 기능

### 인증 / 회원

- [x] 회원가입
- [x] 로그인
- [x] JWT 발급
- [x] JWT 인증 필터
- [x] Spring Security 설정
- [x] 내 정보 조회
- [x] 비밀번호 변경
- [x] BCrypt 비밀번호 암호화
- [x] 이메일 중복 검증
- [x] CurrentUserProvider 구현 및 적용

### 예외 처리

- [x] BusinessException
- [x] ErrorCode
- [x] ErrorResponse
- [x] GlobalExceptionHandler
- [x] Validation 오류 응답
- [x] 도메인별 Custom Exception

### Clothing

- [x] 옷 등록
- [x] 옷 목록 조회
- [x] 옷 상세 조회
- [x] 옷 수정
- [x] 옷 삭제
- [x] 카테고리 검색
- [x] 계절 검색
- [x] 색상 검색
- [x] Specification 적용
- [x] 페이징
- [x] 정렬
- [x] 최신순 정렬
- [x] 사용자 소유권 검증
- [x] CurrentUserProvider 적용
- [x] JPA Auditing
- [x] createdAt / updatedAt 응답

### Coordination

- [x] 코디 등록
- [x] 코디 목록 조회
- [x] 코디 상세 조회
- [x] 코디 수정
- [x] 코디 삭제
- [x] 코디에 옷 추가
- [x] 코디에서 옷 제거
- [x] 같은 옷 중복 추가 방지
- [x] 코디 소유권 검증
- [x] 옷 소유권 검증
- [x] CurrentUserProvider 적용

### CoordinationRecord

- [x] 착용 기록 등록
- [x] 기간별 착용 기록 조회
- [x] 오늘 착용 기록 조회
- [x] 착용 기록 수정
- [x] 착용 기록 삭제
- [x] 중복 착용 기록 검증
- [x] 코디 소유권 검증
- [x] CurrentUserProvider 적용

### 공통

- [x] BaseEntity
- [x] JPA Auditing
- [x] PostgreSQL / Supabase 연동
- [x] Swagger
- [x] 전역 예외 처리

---

## 3. Request DTO Validation

### User

- [x] 회원가입 이메일 필수
- [x] 이메일 형식 검증
- [x] 비밀번호 최소 8자
- [x] 로그인 이메일 필수
- [x] 로그인 이메일 형식
- [x] 로그인 비밀번호 필수
- [x] 현재 비밀번호 필수
- [x] 새 비밀번호 최소 8자

### Clothing

- [x] name 필수
- [x] category 필수
- [x] color 필수
- [x] season 필수
- [x] Create Validation 테스트
- [x] Update Validation 테스트

### Coordination

- [x] name 필수
- [x] description 선택
- [x] Create Validation 테스트
- [x] Update Validation 테스트

### CoordinationRecord

- [x] date 필수
- [x] coordinationId 필수
- [x] Create Validation 테스트
- [x] Update Validation 테스트

---

## 4. Swagger 검증 완료

- [x] User Validation
- [x] 정상 로그인 및 JWT 발급
- [x] Clothing CRUD
- [x] Clothing Validation
- [x] Clothing 검색 / 정렬 / 페이징
- [x] Coordination CRUD
- [x] Coordination Validation
- [x] Coordination-Clothing 추가 / 제거
- [x] Coordination 중복 옷 추가 예외
- [x] CoordinationRecord CRUD
- [x] CoordinationRecord Validation
- [x] CoordinationRecord 기간 조회
- [x] CoordinationRecord 오늘 조회

---

## 5. 현재 진행 상황

| 영역                | 상태         |
| ------------------- | ------------ |
| 프로젝트 초기 설정  | ✅ 완료      |
| PostgreSQL 연결     | ✅ 완료      |
| JWT 인증            | ✅ 완료      |
| Spring Security     | ✅ 완료      |
| 예외 처리           | ✅ 완료      |
| CurrentUserProvider | ✅ 완료      |
| User 핵심 기능      | ✅ 완료      |
| Clothing            | ✅ 완료      |
| Coordination        | ✅ 완료      |
| CoordinationRecord  | ✅ 완료      |
| JPA Auditing        | ✅ 완료      |
| Request Validation  | ✅ 완료      |
| HTTP 상태 코드 정리 | 🔄 다음 작업 |
| Swagger 문서 정리   | ⏳ 예정      |
| 이미지 업로드       | ⏳ 예정      |
| 통합 테스트         | ⏳ 예정      |
| React 연동          | ⏳ 예정      |
| Today 화면          | ⏳ 예정      |
| AI 추천 기능        | ⏳ 예정      |
| 배포                | ⏳ 예정      |

---

## 6. 현재 발견된 개선 사항

### HTTP 응답 코드

현재 일부 API의 상태 코드가 통일되어 있지 않다.

예:

- POST Clothing → 200
- POST Coordination → 200
- POST CoordinationRecord → 200
- DELETE Clothing → 200
- DELETE Coordination → 204
- DELETE CoordinationRecord → 204

목표:

- GET → 200 OK
- POST 생성 → 201 Created
- PUT / PATCH → 200 OK
- DELETE → 204 No Content
- Validation 실패 → 400 Bad Request
- 인증 실패 → 401 Unauthorized
- 권한 없음 → 403 Forbidden
- 데이터 없음 → 404 Not Found
- 중복 → 409 Conflict

### Swagger

실제 응답은 204인데 Swagger 문서에서 200으로 표시되는 API가 존재한다.

HTTP 상태 코드 정리 이후 Swagger 문서도 실제 응답과 일치하도록 수정한다.

### 회원 기능

현재 핵심 회원 기능은 구현되어 있다.

- 회원가입
- 로그인
- 내 정보 조회
- 비밀번호 변경

회원 탈퇴 / 프로필 수정은 VESTI 1차 버전 필요 여부를 추후 결정한다.

---

## 7. Troubleshooting 기록

### Supabase PostgreSQL 연결 실패

증상:

```text
FATAL: (ENOTFOUND) tenant/user ... not found
Unable to determine Dialect without JDBC metadata
```

원인:

Supabase Free 프로젝트가 일시 정지(Paused)되어 PostgreSQL 연결이 실패했다.

해결:

1. Supabase Dashboard 접속
2. VESTI 프로젝트 Resume
3. Session Pooler 연결 정보 확인
4. Spring Boot 재실행
5. DB 연결 및 Swagger 정상 작동 확인

핵심:

`Unable to determine Dialect`가 실제 원인이 아니라 PostgreSQL 연결 실패에 따른 후속 오류였다.

---

## 8. 다음 작업

### NEXT

HTTP 상태 코드 일관성 정리

작업 순서:

1. ClothingController
2. CoordinationController
3. CoordinationRecordController
4. UserController
5. Swagger 재테스트
6. Git Commit
7. CHANGELOG 기록

### HTTP 상태 코드 정리

- [x] ClothingController
- [x] CoordinationController
- [x] CoordinationRecordController
- [ ] UserController
