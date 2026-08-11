package com.vesti.backend.dto.response;

import lombok.Getter;

@Getter
public class StylePostSaveResponse {

    private final Long stylePostId;

    private final boolean saved;

    public StylePostSaveResponse(
            Long stylePostId,
            boolean saved) {

        this.stylePostId = stylePostId;
        this.saved = saved;
    }
}