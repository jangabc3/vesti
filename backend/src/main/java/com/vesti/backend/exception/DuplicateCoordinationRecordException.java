package com.vesti.backend.exception;

public class DuplicateCoordinationRecordException extends BusinessException {

    public DuplicateCoordinationRecordException() {
        super(ErrorCode.DUPLICATE_COORDINATION_RECORD);
    }
}