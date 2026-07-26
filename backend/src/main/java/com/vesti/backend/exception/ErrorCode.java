package com.vesti.backend.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // User
    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER_NOT_FOUND",
            "사용자를 찾을 수 없습니다."),

    DUPLICATE_EMAIL(
            HttpStatus.CONFLICT,
            "DUPLICATE_EMAIL",
            "이미 사용 중인 이메일입니다."),

    INVALID_LOGIN(
            HttpStatus.UNAUTHORIZED,
            "INVALID_LOGIN",
            "이메일 또는 비밀번호가 올바르지 않습니다."),

    CURRENT_PASSWORD_MISMATCH(
            HttpStatus.BAD_REQUEST,
            "CURRENT_PASSWORD_MISMATCH",
            "현재 비밀번호가 일치하지 않습니다."),

    // Clothing
    CLOTHING_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CLOTHING_NOT_FOUND",
            "옷을 찾을 수 없습니다."),

    CLOTHING_ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "CLOTHING_ACCESS_DENIED",
            "해당 옷에 접근할 권한이 없습니다."),

    // Coordination
    COORDINATION_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "COORDINATION_NOT_FOUND",
            "코디를 찾을 수 없습니다."),

    COORDINATION_ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "COORDINATION_ACCESS_DENIED",
            "해당 코디에 접근할 권한이 없습니다."),

    DUPLICATE_COORDINATION_CLOTHING(
            HttpStatus.CONFLICT,
            "DUPLICATE_COORDINATION_CLOTHING",
            "이미 코디에 포함된 옷입니다."),

    COORDINATION_CLOTHING_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "COORDINATION_CLOTHING_NOT_FOUND",
            "코디에 해당 옷이 포함되어 있지 않습니다."),

    // Coordination Record
    COORDINATION_RECORD_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "COORDINATION_RECORD_NOT_FOUND",
            "코디 기록을 찾을 수 없습니다."),

    COORDINATION_RECORD_ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "COORDINATION_RECORD_ACCESS_DENIED",
            "해당 코디 기록에 접근할 권한이 없습니다."),

    DUPLICATE_COORDINATION_RECORD(
            HttpStatus.CONFLICT,
            "DUPLICATE_COORDINATION_RECORD",
            "해당 날짜에 이미 코디 기록이 존재합니다."),

    INVALID_DATE_RANGE(
            HttpStatus.BAD_REQUEST,
            "INVALID_DATE_RANGE",
            "시작 날짜는 종료 날짜보다 늦을 수 없습니다."),

    // Common
    INVALID_INPUT_VALUE(
            HttpStatus.BAD_REQUEST,
            "INVALID_INPUT_VALUE",
            "요청 값이 올바르지 않습니다."),

    INTERNAL_SERVER_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "INTERNAL_SERVER_ERROR",
            "서버 내부 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}