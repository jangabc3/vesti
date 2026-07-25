package com.vesti.backend.exception;

public class ClothingNotFoundException extends RuntimeException {

    public ClothingNotFoundException() {
        super("옷을 찾을 수 없습니다.");
    }
}