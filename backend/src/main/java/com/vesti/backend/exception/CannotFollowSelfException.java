package com.vesti.backend.exception;

public class CannotFollowSelfException
        extends BusinessException {

    public CannotFollowSelfException() {

        super(ErrorCode.CANNOT_FOLLOW_SELF);
    }
}