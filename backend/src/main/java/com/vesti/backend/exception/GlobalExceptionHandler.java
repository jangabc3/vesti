package com.vesti.backend.exception;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // ========================================
        // 1. DTO 입력값 검증 실패
        // ========================================
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

        // ========================================
        // 2. 비즈니스 예외
        // ========================================
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

        // ========================================
        // 3. 이미지 파일 크기 초과
        // ========================================
        @ExceptionHandler(MaxUploadSizeExceededException.class)
        public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
                        MaxUploadSizeExceededException exception,
                        HttpServletRequest request) {

                ErrorCode errorCode = ErrorCode.IMAGE_FILE_TOO_LARGE;

                ErrorResponse response = ErrorResponse.of(
                                errorCode,
                                request.getRequestURI());

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(response);
        }

        // ========================================
        // 4. 예상하지 못한 서버 내부 오류
        // ========================================
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