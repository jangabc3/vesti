package com.vesti.backend.dto.response;

import java.time.LocalDateTime;

import com.vesti.backend.entity.User;

import lombok.Getter;

@Getter
public class UserResponse {

    private final Long id;
    private final String email;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
}