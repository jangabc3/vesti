package com.vesti.backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        /*
         * DTO의 유효성 검사 실패 처리
         *
         * 예:
         * 
         * @NotBlank가 붙은 필드에 빈 문자열이 들어온 경우
         *
         * HTTP 상태 코드: 400 Bad Request
         */
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidationException(
                        MethodArgumentNotValidException exception) {

                Map<String, String> errors = new HashMap<>();

                exception.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> errors.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(errors);
        }

        /*
         * 로그인 정보가 올바르지 않은 경우
         *
         * HTTP 상태 코드: 401 Unauthorized
         */
        @ExceptionHandler(InvalidLoginException.class)
        public ResponseEntity<Map<String, String>> handleInvalidLogin(
                        InvalidLoginException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(response);
        }

        /*
         * 요청한 옷을 찾을 수 없는 경우
         *
         * HTTP 상태 코드: 404 Not Found
         */
        @ExceptionHandler(ClothingNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleClothingNotFound(
                        ClothingNotFoundException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        /*
         * 다른 사용자의 옷에 접근한 경우
         *
         * HTTP 상태 코드: 403 Forbidden
         */
        @ExceptionHandler(ClothingAccessDeniedException.class)
        public ResponseEntity<Map<String, String>> handleClothingAccessDenied(
                        ClothingAccessDeniedException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(response);
        }

        /*
         * 사용자를 찾을 수 없는 경우
         *
         * HTTP 상태 코드: 404 Not Found
         */
        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleUserNotFound(
                        UserNotFoundException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        /*
         * 이미 가입된 이메일로 회원가입을 시도한 경우
         *
         * HTTP 상태 코드: 409 Conflict
         */
        @ExceptionHandler(DuplicateEmailException.class)
        public ResponseEntity<Map<String, String>> handleDuplicateEmail(
                        DuplicateEmailException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        /*
         * 요청한 코디를 찾을 수 없는 경우
         *
         * HTTP 상태 코드: 404 Not Found
         */
        @ExceptionHandler(CoordinationNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleCoordinationNotFound(
                        CoordinationNotFoundException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        /*
         * 요청한 코디 기록을 찾을 수 없는 경우
         *
         * HTTP 상태 코드: 404 Not Found
         */
        @ExceptionHandler(CoordinationRecordNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleCoordinationRecordNotFound(
                        CoordinationRecordNotFoundException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        /*
         * 다른 사용자의 코디 기록에 접근한 경우
         *
         * HTTP 상태 코드: 403 Forbidden
         */
        @ExceptionHandler(CoordinationRecordAccessDeniedException.class)
        public ResponseEntity<Map<String, String>> handleCoordinationRecordAccessDenied(
                        CoordinationRecordAccessDeniedException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(response);
        }

        /*
         * 다른 사용자의 코디에 접근한 경우
         *
         * HTTP 상태 코드: 403 Forbidden
         */
        @ExceptionHandler(CoordinationAccessDeniedException.class)
        public ResponseEntity<Map<String, String>> handleCoordinationAccessDenied(
                        CoordinationAccessDeniedException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(response);
        }

        /*
         * 이미 코디에 들어 있는 옷을 다시 추가한 경우
         *
         * HTTP 상태 코드: 409 Conflict
         */
        @ExceptionHandler(DuplicateCoordinationClothingException.class)
        public ResponseEntity<Map<String, String>> handleDuplicateCoordinationClothing(
                        DuplicateCoordinationClothingException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        /*
         * 코디에 해당 옷이 포함되어 있지 않은 경우
         *
         * HTTP 상태 코드: 404 Not Found
         */
        @ExceptionHandler(CoordinationClothingNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleCoordinationClothingNotFound(
                        CoordinationClothingNotFoundException exception) {

                Map<String, String> response = Map.of(
                                "message", exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }
}