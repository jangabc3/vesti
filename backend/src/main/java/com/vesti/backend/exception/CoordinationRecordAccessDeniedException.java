package com.vesti.backend.exception;

public class CoordinationRecordAccessDeniedException
        extends RuntimeException {

    public CoordinationRecordAccessDeniedException() {
        super("해당 코디 기록에 접근할 권한이 없습니다.");
    }
}