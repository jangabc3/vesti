package com.vesti.backend.exception;

public class DuplicateCoordinationClothingException extends RuntimeException {

    public DuplicateCoordinationClothingException() {
        super("이미 코디에 추가된 옷입니다.");
    }
}