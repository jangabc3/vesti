package com.vesti.backend.exception;

public class CoordinationRecordAccessDeniedException extends BusinessException {

    public CoordinationRecordAccessDeniedException() {
        super(ErrorCode.COORDINATION_RECORD_ACCESS_DENIED);
    }
}