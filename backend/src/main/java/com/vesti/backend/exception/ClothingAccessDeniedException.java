package com.vesti.backend.exception;

public class ClothingAccessDeniedException extends RuntimeException {

    public ClothingAccessDeniedException() {
        super("권한이 없습니다.");
    }
}