package com.vesti.backend.exception;

public class CoordinationNotFoundException extends BusinessException {

    public CoordinationNotFoundException() {
        super(ErrorCode.COORDINATION_NOT_FOUND);
    }
}