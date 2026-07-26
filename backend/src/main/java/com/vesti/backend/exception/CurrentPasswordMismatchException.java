package com.vesti.backend.exception;

public class CurrentPasswordMismatchException extends BusinessException {

    public CurrentPasswordMismatchException() {
        super(ErrorCode.CURRENT_PASSWORD_MISMATCH);
    }
}