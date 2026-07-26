package com.vesti.backend.exception;

public class CoordinationRecordNotFoundException extends BusinessException {

    public CoordinationRecordNotFoundException() {
        super(ErrorCode.COORDINATION_RECORD_NOT_FOUND);
    }
}