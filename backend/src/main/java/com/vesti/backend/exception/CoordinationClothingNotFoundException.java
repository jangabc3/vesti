package com.vesti.backend.exception;

public class CoordinationClothingNotFoundException
        extends RuntimeException {

    public CoordinationClothingNotFoundException() {
        super("코디에 해당 옷이 포함되어 있지 않습니다.");
    }
}