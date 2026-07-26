package com.vesti.backend.exception;

public class ClothingAccessDeniedException extends BusinessException {

    public ClothingAccessDeniedException() {
        super(ErrorCode.CLOTHING_ACCESS_DENIED);
    }
}