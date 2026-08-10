# VESTI 프로젝트 진행 로그

> 마지막 업데이트: 2026-08-10

---

## 1. 프로젝트 개요

### VESTI

개인 옷장을 관리하고 착용 기록을 저장하며,
향후 AI 기반 코디 추천까지 제공하는 개인 스타일 관리 서비스.

### Backend Stack

- Java 21
- Spring Boot
- Spring Security
- JWT
- BCrypt
- Spring Data JPA
- PostgreSQL
- Supabase
- Swagger / OpenAPI
- Gradle

---

## 2. 전체 진행 상황

| 영역                       | 상태         |
| -------------------------- | ------------ |
| 프로젝트 초기 설정         | ✅ 완료      |
| PostgreSQL / Supabase 연결 | ✅ 완료      |
| JWT 인증                   | ✅ 완료      |
| Spring Security            | ✅ 완료      |
| 전역 예외 처리             | ✅ 완료      |
| CurrentUserProvider        | ✅ 완료      |
| User 핵심 기능             | ✅ 완료      |
| Clothing                   | ✅ 완료      |
| Coordination               | ✅ 완료      |
| CoordinationRecord         | ✅ 완료      |
| JPA Auditing               | ✅ 완료      |
| Request Validation         | ✅ 완료      |
| HTTP 상태 코드 정리        | ✅ 완료      |
| Swagger / OpenAPI 문서화   | ✅ 완료      |
| 옷 이미지 업로드           | 🔄 다음 작업 |
| 백엔드 통합 테스트         | ⏳ 예정      |
| React 연동                 | ⏳ 예정      |
| Today 화면                 | ⏳ 예정      |
| AI 추천 기능               | ⏳ 예정      |
| 배포                       | ⏳ 예정      |

---

## 3. 구현 완료 기능

### Authentication / User

- [x] 회원가입
- [x] 로그인
- [x] JWT 발급
- [x] JWT 인증 필터
- [x] Spring Security 설정
- [x] BCrypt 비밀번호 암호화
- [x] 이메일 중복 검증
- [x] 내 정보 조회
- [x] 비밀번호 변경
- [x] CurrentUserProvider 구현 및 적용

> 회원 탈퇴 및 프로필 수정 기능은 VESTI 1차 버전 필요 여부에 따라 추후 결정한다.

---

### Exception Handling

- [x] BusinessException
- [x] ErrorCode
- [x] ErrorResponse
- [x] GlobalExceptionHandler
- [x] DTO Validation 오류 응답
- [x] 도메인별 Custom Exception

현재 주요 HTTP 오류 규칙:

- 400 Bad Request → 입력값 오류
- 401 Unauthorized → 인증 실패
- 403 Forbidden → 접근 권한 없음
- 404 Not Found → 데이터 없음
- 409 Conflict → 중복 데이터
- 500 Internal Server Error → 서버 내부 오류

---

### Clothing

- [x] 옷 등록
- [x] 옷 목록 조회
- [x] 옷 상세 조회
- [x] 옷 수정
- [x] 옷 삭제
- [x] 카테고리 검색
- [x] 계절 검색
- [x] 색상 검색
- [x] Spring Data Specification 적용
- [x] 페이지네이션
- [x] 정렬
- [x] 최신순 정렬
- [x] 사용자 소유권 검증
- [x] CurrentUserProvider 적용
- [x] JPA Auditing
- [x] createdAt / updatedAt 응답

---

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

---

### CoordinationRecord

- [x] 착용 기록 등록
- [x] 기간별 착용 기록 조회
- [x] 오늘 착용 기록 조회
- [x] 착용 기록 수정
- [x] 착용 기록 삭제
- [x] 날짜별 중복 기록 방지
- [x] 코디 소유권 검증
- [x] 기록 소유권 검증
- [x] CurrentUserProvider 적용

---

### Common

- [x] BaseEntity
- [x] JPA Auditing
- [x] createdAt
- [x] updatedAt
- [x] PostgreSQL / Supabase 연동
- [x] Swagger / OpenAPI
- [x] 전역 예외 처리

---

## 4. Request DTO Validation

### User

- [x] 회원가입 이메일 필수
- [x] 이메일 형식 검증
- [x] 비밀번호 최소 8자
- [x] 로그인 이메일 필수
- [x] 로그인 이메일 형식 검증
- [x] 로그인 비밀번호 필수
- [x] 현재 비밀번호 필수
- [x] 새 비밀번호 최소 8자

### Clothing

- [x] name 필수
- [x] category 필수
- [x] color 필수
- [x] season 필수
- [x] Create Validation 검증
- [x] Update Validation 검증

### Coordination

- [x] name 필수
- [x] description 선택
- [x] Create Validation 검증
- [x] Update Validation 검증

### CoordinationRecord

- [x] date 필수
- [x] coordinationId 필수
- [x] Create Validation 검증
- [x] Update Validation 검증

---

## 5. HTTP 상태 코드 규칙

### 성공 응답

| 작업                | HTTP Status    |
| ------------------- | -------------- |
| GET 조회            | 200 OK         |
| POST 리소스 생성    | 201 Created    |
| PUT 수정            | 200 OK         |
| PATCH 비밀번호 변경 | 204 No Content |
| DELETE              | 204 No Content |

### 오류 응답

| 상황             | HTTP Status               |
| ---------------- | ------------------------- |
| 입력값 검증 실패 | 400 Bad Request           |
| 인증 실패        | 401 Unauthorized          |
| 접근 권한 없음   | 403 Forbidden             |
| 데이터 없음      | 404 Not Found             |
| 중복             | 409 Conflict              |
| 서버 내부 오류   | 500 Internal Server Error |

---

## 6. Swagger / OpenAPI

### API 그룹

- [x] User
- [x] Clothing
- [x] Coordination
- [x] Coordination Record
- [x] Health

### 문서화

- [x] API Summary
- [x] API Description
- [x] 성공 HTTP 상태 코드
- [x] 오류 HTTP 상태 코드
- [x] ErrorResponse Schema
- [x] Validation 오류 문서화

### Swagger 기능 검증

#### User

- [x] 회원가입
- [x] 로그인
- [x] JWT 발급
- [x] 내 정보 조회
- [x] 비밀번호 변경

#### Clothing

- [x] CRUD
- [x] Validation
- [x] 검색
- [x] 정렬
- [x] 페이지네이션

#### Coordination

- [x] CRUD
- [x] Validation
- [x] 코디에 옷 추가
- [x] 코디에서 옷 제거
- [x] 같은 옷 중복 추가 예외

#### Coordination Record

- [x] CRUD
- [x] Validation
- [x] 기간별 조회
- [x] 오늘 조회
- [x] 날짜 중복 예외

#### Health

- [x] 서버 상태 확인

---

## 7. Troubleshooting

### Supabase PostgreSQL 연결 실패

#### 증상

```text
FATAL: (ENOTFOUND) tenant/user ... not found
Unable to determine Dialect without JDBC metadata
```

#### 원인

Supabase Free 프로젝트가 Paused 상태가 되면서 PostgreSQL 연결이 실패했다.

`Unable to determine Dialect` 오류는 실제 원인이 아니라
데이터베이스 연결 실패 이후 발생한 후속 오류였다.

#### 해결

1. Supabase Dashboard 접속
2. VESTI 프로젝트 Resume
3. Session Pooler 연결 정보 확인
4. Spring Boot 재실행
5. PostgreSQL 연결 확인
6. Swagger 정상 동작 확인

#### 배운 점

오류를 해결할 때 마지막 에러 메시지만 확인하지 않고
로그에서 가장 먼저 발생한 원인을 확인해야 한다.

---

## 8. 현재 NEXT

### 옷 이미지 업로드

사용자가 자신의 옷 사진을 등록하고,
VESTI 옷장에서 해당 이미지를 조회할 수 있도록 구현한다.

### 목표 구조

```text
사용자
  ↓
옷 이미지 선택
  ↓
Spring Boot
  ↓
Supabase Storage
  ↓
이미지 저장
  ↓
이미지 URL 생성
  ↓
PostgreSQL clothing.image_url 저장
  ↓
React에서 이미지 표시
```

### 설계 방향

실제 이미지 파일은 PostgreSQL에 직접 저장하지 않는다.

```text
Supabase Storage
→ 이미지 파일 저장

PostgreSQL
→ 이미지 URL 저장
```

예상 Clothing 데이터 구조:

```text
clothing

id
user_id
name
category
color
season
image_url
created_at
updated_at
```

---

## 9. 이미지 업로드 구현 예정 순서

- [ ] STEP 1. Clothing Entity 이미지 필드 설계
- [ ] STEP 2. `imageUrl` DB 컬럼 추가
- [ ] STEP 3. ClothingResponse에 `imageUrl` 추가
- [ ] STEP 4. Supabase Storage Bucket 구성
- [ ] STEP 5. Spring Boot Storage 설정
- [ ] STEP 6. MultipartFile 이미지 업로드 API 구현
- [ ] STEP 7. 이미지 URL DB 저장
- [ ] STEP 8. Swagger 이미지 업로드 테스트
- [ ] STEP 9. 이미지 수정 및 삭제 정책 적용
- [ ] STEP 10. Git Commit 및 CHANGELOG 업데이트

---

## 10. 이후 로드맵

```text
현재
 ↓
옷 이미지 업로드
 ↓
백엔드 통합 테스트
 ↓
React 연동
 ↓
Today 화면
 ↓
AI 코디 추천
 ↓
배포
```
