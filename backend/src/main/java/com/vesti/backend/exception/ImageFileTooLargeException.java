package com.vesti.backend.exception;

public class ImageFileTooLargeException extends BusinessException {

    public ImageFileTooLargeException() {
        super(ErrorCode.IMAGE_FILE_TOO_LARGE);
    }
}