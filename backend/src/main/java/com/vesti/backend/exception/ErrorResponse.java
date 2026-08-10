package com.vesti.backend.exception;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.validation.FieldError;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {

    private final LocalDateTime timestamp;
    private final int status;
    private final String code;
    private final String message;
    private final String path;

    @Builder.Default
    private final List<ValidationError> errors = Collections.emptyList();

    // 일반 비즈니스 예외 응답
    public static ErrorResponse of(
            ErrorCode errorCode,
            String path) {

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .build();
    }

    // Validation 예외 응답
    public static ErrorResponse of(
            ErrorCode errorCode,
            String path,
            List<FieldError> fieldErrors) {

        Map<String, ValidationError> errorMap = new LinkedHashMap<>();

        for (FieldError fieldError : fieldErrors) {
            errorMap.putIfAbsent(
                    fieldError.getField(),
                    ValidationError.from(fieldError));
        }

        List<ValidationError> errors = errorMap.values()
                .stream()
                .toList();

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .errors(errors)
                .build();
    }

    @Getter
    @Builder
    public static class ValidationError {

        private final String field;
        private final String message;

        public static ValidationError from(FieldError fieldError) {

            return ValidationError.builder()
                    .field(fieldError.getField())
                    .message(fieldError.getDefaultMessage())
                    .build();
        }
    }
}