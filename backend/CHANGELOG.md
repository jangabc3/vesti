# VESTI CHANGELOG

VESTI 프로젝트의 주요 기능 구현, 리팩토링, 장애 해결 및 문서화 이력을 기록한다.

---

## 2026-08-10 — Request DTO Validation 전체 점검

### 작업 목적

User, Clothing, Coordination, CoordinationRecord 요청 DTO의 입력값 검증을 전체 점검했다.

### User

검증 항목:

- 회원가입 이메일 필수
- 이메일 형식 검증
- 비밀번호 최소 8자
- 로그인 이메일 필수
- 로그인 이메일 형식 검증
- 로그인 비밀번호 필수
- 현재 비밀번호 필수
- 새 비밀번호 최소 8자

Swagger 검증:

- [x] 빈 이메일 → 400 Bad Request
- [x] 빈 비밀번호 → 400 Bad Request
- [x] 잘못된 이메일 형식 → 400 Bad Request
- [x] 정상 로그인
- [x] 8자 미만 새 비밀번호 → 400 Bad Request

### Clothing

검증 항목:

- name 필수
- category 필수
- color 필수
- season 필수

Swagger 검증:

- [x] 등록 Validation → 400 Bad Request
- [x] 정상 등록
- [x] 수정 Validation → 400 Bad Request
- [x] 정상 수정
- [x] 테스트 데이터 삭제

### Coordination

검증 항목:

- name 필수
- description 선택

Swagger 검증:

- [x] 등록 Validation → 400 Bad Request
- [x] description 없이 등록
- [x] 수정 Validation → 400 Bad Request
- [x] 정상 수정
- [x] 삭제 → 204 No Content

### CoordinationRecord

검증 항목:

- date 필수
- coordinationId 필수

Swagger 검증:

- [x] 등록 Validation → 400 Bad Request
- [x] 정상 등록
- [x] 수정 Validation → 400 Bad Request
- [x] 정상 수정
- [x] 삭제 → 204 No Content

### 결과

Request DTO Validation 전체 점검을 완료했다.

---

## 2026-08-10 — Supabase PostgreSQL 연결 장애 해결

### 증상

Spring Boot 실행 시 다음 오류가 발생했다.

```text
FATAL: (ENOTFOUND) tenant/user ... not found
```

이후 Hibernate에서 다음 오류가 연속으로 발생했다.

```text
Unable to determine Dialect without JDBC metadata
```

### 원인

Supabase Free 프로젝트가 Paused 상태가 되면서 PostgreSQL 연결이 실패했다.

Hibernate Dialect 오류는 실제 원인이 아니라 데이터베이스 연결 실패 이후 발생한 후속 오류였다.

### 해결

1. Supabase Dashboard 접속
2. VESTI 프로젝트 Resume
3. Session Pooler 연결 정보 확인
4. PostgreSQL 재연결
5. Spring Boot 재실행
6. Swagger 및 데이터베이스 연결 정상 동작 확인

### 배운 점

Hibernate 관련 오류가 표시되더라도 바로 JPA 설정 문제라고 판단하지 않는다.

로그에서 가장 먼저 발생한 오류부터 확인하여 실제 원인을 찾는 것이 중요하다.

---

## 2026-08-10 — HTTP 상태 코드 일관성 정리

### 작업 목적

API별로 서로 다르게 사용되던 성공 응답 상태 코드를 HTTP 의미에 맞게 통일했다.

### 적용 규칙

- GET 조회 → 200 OK
- POST 리소스 생성 → 201 Created
- PUT 수정 → 200 OK
- PATCH 비밀번호 변경 → 204 No Content
- DELETE → 204 No Content
- Validation 실패 → 400 Bad Request
- 인증 실패 → 401 Unauthorized
- 권한 없음 → 403 Forbidden
- 데이터 없음 → 404 Not Found
- 중복 → 409 Conflict

### Clothing

- POST `/api/clothes` → 201 Created
- GET `/api/clothes/{id}` → 200 OK
- PUT `/api/clothes/{id}` → 200 OK
- DELETE `/api/clothes/{id}` → 204 No Content
- 삭제된 옷 조회 → 404 Not Found

### Coordination

- POST `/api/coordinations` → 201 Created
- GET `/api/coordinations/{id}` → 200 OK
- PUT `/api/coordinations/{id}` → 200 OK
- DELETE `/api/coordinations/{id}` → 204 No Content

### CoordinationRecord

- POST `/api/coordination-records` → 201 Created
- GET `/api/coordination-records` → 200 OK
- GET `/api/coordination-records/today` → 200 OK
- PUT `/api/coordination-records/{id}` → 200 OK
- DELETE `/api/coordination-records/{id}` → 204 No Content

### User

- POST `/users/signup` → 201 Created
- POST `/users/login` → 200 OK
- GET `/users/me` → 200 OK
- PATCH `/users/me/password` → 204 No Content
- 변경된 비밀번호를 사용한 재로그인 성공 확인

### 결과

API의 실제 동작과 HTTP 의미가 일치하도록 성공 응답 상태 코드를 정리했다.

Swagger를 이용하여 변경된 상태 코드가 실제 요청에서도 정상적으로 반환되는 것을 확인했다.

---

## 2026-08-10 — Swagger / OpenAPI 문서 정리

### 작업 목적

실제 API 동작과 Swagger에 표시되는 문서를 일치시키고,
API의 역할과 성공 및 실패 응답을 쉽게 확인할 수 있도록 개선했다.

### API 그룹 정리

다음 API 그룹을 Swagger에 구성했다.

- User
- Clothing
- Coordination
- Coordination Record
- Health

### API 설명 추가

다음 OpenAPI Annotation을 적용했다.

- `@Tag`
- `@Operation`
- `@ApiResponse`
- `@ApiResponses`

각 API에 다음 정보를 추가했다.

- API 이름
- API 설명
- 성공 HTTP 상태 코드
- 실패 HTTP 상태 코드

### 오류 응답 문서화

다음 오류 상태 코드에 `ErrorResponse` Schema를 연결했다.

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict

오류 응답의 공통 구조:

```text
timestamp
status
code
message
path
errors
```

### User

- [x] 회원가입 문서화
- [x] 로그인 문서화
- [x] 내 정보 조회 문서화
- [x] 비밀번호 변경 문서화
- [x] ErrorResponse Schema 연결

### Clothing

- [x] 옷 등록 문서화
- [x] 옷 목록 조회 문서화
- [x] 옷 상세 조회 문서화
- [x] 옷 수정 문서화
- [x] 옷 삭제 문서화
- [x] ErrorResponse Schema 연결

### Coordination

- [x] 코디 등록 문서화
- [x] 코디 목록 조회 문서화
- [x] 코디 상세 조회 문서화
- [x] 코디 수정 문서화
- [x] 코디 삭제 문서화
- [x] 코디에 옷 추가 API 문서화
- [x] 코디에서 옷 제거 API 문서화
- [x] ErrorResponse Schema 연결

### Coordination Record

- [x] 코디 기록 등록 문서화
- [x] 기간별 코디 기록 조회 문서화
- [x] 오늘의 코디 조회 문서화
- [x] 코디 기록 수정 문서화
- [x] 코디 기록 삭제 문서화
- [x] ErrorResponse Schema 연결

### Health

- [x] Health API 그룹 구성
- [x] 서버 상태 확인 API 문서화
- [x] 200 OK 응답 문서화

### 결과

- [x] 실제 API와 Swagger HTTP 상태 코드 일치
- [x] 성공 응답 문서화
- [x] 오류 응답 문서화
- [x] ErrorResponse Schema 연결
- [x] Swagger API 그룹명 정리
- [x] 주요 API 설명 추가

Swagger / OpenAPI 문서 정리를 완료했다.

### 다음 작업

옷 이미지 업로드 기능 설계 및 구현
