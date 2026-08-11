package com.vesti.backend.exception;

public class StylePostAccessDeniedException
        extends BusinessException {

    public StylePostAccessDeniedException() {

        super(ErrorCode.STYLE_POST_ACCESS_DENIED);
    }
}