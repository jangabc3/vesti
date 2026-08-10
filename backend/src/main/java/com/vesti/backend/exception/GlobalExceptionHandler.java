package com.vesti.backend.exception;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // DTO 유효성 검사 실패
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(
                        MethodArgumentNotValidException exception,
                        HttpServletRequest request) {

                ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;

                ErrorResponse response = ErrorResponse.of(
                                errorCode,
                                request.getRequestURI(),
                                exception.getBindingResult().getFieldErrors());

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(response);
        }

        // 모든 비즈니스 예외 처리
        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ErrorResponse> handleBusinessException(
                        BusinessException exception,
                        HttpServletRequest request) {

                ErrorCode errorCode = exception.getErrorCode();

                ErrorResponse response = ErrorResponse.of(
                                errorCode,
                                request.getRequestURI());

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(response);
        }

        // 예상하지 못한 서버 내부 예외 처리
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleException(
                        Exception exception,
                        HttpServletRequest request) {

                ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

                ErrorResponse response = ErrorResponse.of(
                                errorCode,
                                request.getRequestURI());

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(response);
        }
}