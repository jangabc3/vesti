package com.vesti.backend.exception;

public class InvalidImageFileException extends BusinessException {

    public InvalidImageFileException() {
        super(ErrorCode.INVALID_IMAGE_FILE);
    }
}