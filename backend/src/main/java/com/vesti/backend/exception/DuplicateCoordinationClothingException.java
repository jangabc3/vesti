package com.vesti.backend.exception;

public class DuplicateCoordinationClothingException extends BusinessException {

    public DuplicateCoordinationClothingException() {
        super(ErrorCode.DUPLICATE_COORDINATION_CLOTHING);
    }
}