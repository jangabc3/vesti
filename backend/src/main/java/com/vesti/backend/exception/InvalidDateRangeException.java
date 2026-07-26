package com.vesti.backend.exception;

public class InvalidDateRangeException extends BusinessException {

    public InvalidDateRangeException() {
        super(ErrorCode.INVALID_DATE_RANGE);
    }
}