package com.vesti.backend.exception;

public class CoordinationAccessDeniedException extends RuntimeException {

    public CoordinationAccessDeniedException() {
        super("해당 코디에 접근할 권한이 없습니다.");
    }
}