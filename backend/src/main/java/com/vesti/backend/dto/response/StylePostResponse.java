package com.vesti.backend.dto.response;

import java.time.LocalDateTime;

import com.vesti.backend.entity.StylePost;
import com.vesti.backend.entity.User;

import lombok.Getter;

@Getter
public class StylePostResponse {

    private final Long id;

    private final AuthorResponse author;

    private final String title;

    private final String caption;

    private final String imageUrl;

    private final String location;

    private final LocalDateTime createdAt;

    private final LocalDateTime updatedAt;

    public StylePostResponse(
            StylePost stylePost) {

        this.id = stylePost.getId();

        this.author = new AuthorResponse(
                stylePost.getUser());

        this.title = stylePost.getTitle();

        this.caption = stylePost.getCaption();

        this.imageUrl = stylePost.getImageUrl();

        this.location = stylePost.getLocation();

        this.createdAt = stylePost.getCreatedAt();

        this.updatedAt = stylePost.getUpdatedAt();
    }

    @Getter
    public static class AuthorResponse {

        private final Long id;

        private final String username;

        private final String displayName;

        private final String profileImageUrl;

        public AuthorResponse(
                User user) {

            this.id = user.getId();

            this.username = resolveUsername(user);

            this.displayName = resolveDisplayName(user);

            this.profileImageUrl = user.getProfileImageUrl();
        }

        private String resolveUsername(
                User user) {

            if (user.getUsername() != null
                    && !user.getUsername().isBlank()) {

                return user.getUsername();
            }

            return "user" + user.getId();
        }

        private String resolveDisplayName(
                User user) {

            if (user.getDisplayName() != null
                    && !user.getDisplayName().isBlank()) {

                return user.getDisplayName();
            }

            return resolveUsername(user);
        }
    }
}