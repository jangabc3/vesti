package com.vesti.backend.exception;

public class CoordinationClothingNotFoundException extends BusinessException {

    public CoordinationClothingNotFoundException() {
        super(ErrorCode.COORDINATION_CLOTHING_NOT_FOUND);
    }
}