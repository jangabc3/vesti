package com.vesti.backend.exception;

public class CoordinationAccessDeniedException extends BusinessException {

    public CoordinationAccessDeniedException() {
        super(ErrorCode.COORDINATION_ACCESS_DENIED);
    }
}