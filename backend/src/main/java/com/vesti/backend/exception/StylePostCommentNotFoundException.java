package com.vesti.backend.exception;

public class StylePostCommentNotFoundException
        extends BusinessException {

    public StylePostCommentNotFoundException() {

        super(ErrorCode.STYLE_POST_COMMENT_NOT_FOUND);
    }
}