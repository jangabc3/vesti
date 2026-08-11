package com.vesti.backend.dto.response;

import lombok.Getter;

@Getter
public class UserFollowStatusResponse {

    private final Long userId;

    private final String username;

    private final boolean following;

    private final long followerCount;

    private final long followingCount;

    public UserFollowStatusResponse(
            Long userId,
            String username,
            boolean following,
            long followerCount,
            long followingCount) {

        this.userId = userId;

        this.username = username;

        this.following = following;

        this.followerCount = followerCount;

        this.followingCount = followingCount;
    }
}