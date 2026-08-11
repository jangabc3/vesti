package com.vesti.backend.exception;

public class StylePostNotFoundException
        extends BusinessException {

    public StylePostNotFoundException() {

        super(ErrorCode.STYLE_POST_NOT_FOUND);
    }
}