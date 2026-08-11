package com.vesti.backend.dto.response;

import java.time.LocalDateTime;

import com.vesti.backend.entity.StylePostComment;
import com.vesti.backend.entity.User;

import lombok.Getter;

@Getter
public class StylePostCommentResponse {

    private final Long id;

    private final Long stylePostId;

    private final AuthorResponse author;

    private final String content;

    private final LocalDateTime createdAt;

    private final LocalDateTime updatedAt;

    public StylePostCommentResponse(
            StylePostComment comment) {

        this.id = comment.getId();

        this.stylePostId = comment.getStylePost().getId();

        this.author = new AuthorResponse(
                comment.getUser());

        this.content = comment.getContent();

        this.createdAt = comment.getCreatedAt();

        this.updatedAt = comment.getUpdatedAt();
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