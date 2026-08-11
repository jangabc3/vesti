package com.vesti.backend.dto.response;

import lombok.Getter;

@Getter
public class StylePostLikeResponse {

    private final Long stylePostId;

    private final boolean liked;

    private final long likeCount;

    public StylePostLikeResponse(
            Long stylePostId,
            boolean liked,
            long likeCount) {

        this.stylePostId = stylePostId;

        this.liked = liked;

        this.likeCount = likeCount;
    }
}