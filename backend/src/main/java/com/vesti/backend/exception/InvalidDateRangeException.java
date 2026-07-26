package com.vesti.backend.exception;

public class InvalidDateRangeException extends RuntimeException {

    public InvalidDateRangeException() {
        super("시작 날짜는 종료 날짜보다 늦을 수 없습니다.");
    }
}