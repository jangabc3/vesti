package com.vesti.backend.dto.response;

import com.vesti.backend.entity.User;

import lombok.Getter;

@Getter
public class PublicUserResponse {

    private final Long id;
    private final String username;
    private final String displayName;
    private final String profileImageUrl;
    private final String bio;

    public PublicUserResponse(User user) {

        this.id = user.getId();
        this.username = resolveUsername(user);
        this.displayName = resolveDisplayName(user);
        this.profileImageUrl = user.getProfileImageUrl();
        this.bio = user.getBio();
    }

    private String resolveUsername(User user) {

        if (user.getUsername() != null
                && !user.getUsername().isBlank()) {

            return user.getUsername();
        }

        return "user" + user.getId();
    }

    private String resolveDisplayName(User user) {

        if (user.getDisplayName() != null
                && !user.getDisplayName().isBlank()) {

            return user.getDisplayName();
        }

        return resolveUsername(user);
    }
}