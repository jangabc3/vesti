# VESTI CHANGELOG

VESTI 프로젝트의 주요 구현 및 리팩토링 기록을 관리한다.

---

## 2026-08-10 — Request DTO Validation 전체 점검

### 작업 내용

User, Clothing, Coordination, CoordinationRecord의 요청 DTO Validation을 전체 점검했다.

### User

추가 및 확인:

- 로그인 이메일 필수 검증
- 로그인 이메일 형식 검증
- 로그인 비밀번호 필수 검증
- 현재 비밀번호 필수 검증
- 새 비밀번호 최소 8자 검증

Swagger:

- [x] 빈 이메일 → 400
- [x] 빈 비밀번호 → 400
- [x] 잘못된 이메일 → 400
- [x] 정상 로그인 → 200
- [x] 8자 미만 새 비밀번호 → 400

### Clothing

검증 항목:

- name
- category
- color
- season

Swagger:

- [x] 등록 Validation → 400
- [x] 정상 등록 → 200
- [x] 수정 Validation → 400
- [x] 정상 수정 → 200
- [x] 테스트 데이터 삭제

### Coordination

검증 항목:

- name 필수
- description 선택

Swagger:

- [x] 등록 Validation → 400
- [x] description 없이 등록 → 200
- [x] 수정 Validation → 400
- [x] 정상 수정 → 200
- [x] 삭제 → 204

### CoordinationRecord

검증 항목:

- date 필수
- coordinationId 필수

Swagger:

- [x] 등록 Validation → 400
- [x] 정상 등록 → 200
- [x] 수정 Validation → 400
- [x] 정상 수정 → 200
- [x] 삭제 → 204

### 결과

Request DTO Validation 전체 점검 완료.

---

## 2026-08-10 — Supabase 연결 장애 해결

### 증상

Spring Boot 실행 시 다음 오류 발생:

```text
FATAL: (ENOTFOUND) tenant/user ... not found
```

이후 Hibernate에서:

```text
Unable to determine Dialect without JDBC metadata
```

오류가 발생했다.

### 원인

Supabase Free 프로젝트가 Paused 상태였다.

### 해결

- Supabase 프로젝트 Resume
- Session Pooler 정보 확인
- PostgreSQL 재연결
- Spring Boot 재실행
- Swagger 접속 성공

### 배운 점

Hibernate Dialect 오류만 보고 JPA 설정 문제라고 판단하면 안 된다.

로그에서 가장 먼저 발생한 데이터베이스 연결 오류를 확인해야 한다.

---

## 이전 완료 작업

### Authentication

- JWT 로그인
- Spring Security
- BCrypt
- CurrentUserProvider

### Exception Handling

- BusinessException
- ErrorCode
- ErrorResponse
- GlobalExceptionHandler
- Validation Error Response

### Clothing

- CRUD
- 검색
- 페이징
- 정렬
- Specification
- 소유권 검증
- JPA Auditing

### Coordination

- CRUD
- Coordination-Clothing 관계 관리
- 중복 옷 추가 방지
- 소유권 검증
- CurrentUserProvider 적용

### CoordinationRecord

- CRUD
- 기간 조회
- 오늘 조회
- 중복 검증
- 소유권 검증
- CurrentUserProvider 적용

### JPA Auditing

- BaseEntity
- createdAt
- updatedAt

---

## 다음 작업

HTTP 상태 코드 일관성 정리
