package com.vesti.backend.exception;

public class ClothingNotFoundException extends BusinessException {

    public ClothingNotFoundException() {
        super(ErrorCode.CLOTHING_NOT_FOUND);
    }
}