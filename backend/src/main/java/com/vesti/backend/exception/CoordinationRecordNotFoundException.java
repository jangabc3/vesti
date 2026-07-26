package com.vesti.backend.exception;

public class CoordinationRecordNotFoundException extends RuntimeException {

    public CoordinationRecordNotFoundException() {
        super("코디 기록을 찾을 수 없습니다.");
    }
}