package com.vesti.backend.exception;

public class DuplicateCoordinationRecordException
        extends RuntimeException {

    public DuplicateCoordinationRecordException() {
        super("해당 날짜에는 이미 코디 기록이 존재합니다.");
    }
}