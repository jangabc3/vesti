package com.vesti.backend.exception;

public class StylePostCommentAccessDeniedException
        extends BusinessException {

    public StylePostCommentAccessDeniedException() {

        super(ErrorCode.STYLE_POST_COMMENT_ACCESS_DENIED);
    }
}