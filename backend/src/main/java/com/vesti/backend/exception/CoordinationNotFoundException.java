package com.vesti.backend.exception;

public class CoordinationNotFoundException extends RuntimeException {

    public CoordinationNotFoundException() {
        super("코디를 찾을 수 없습니다.");
    }
}