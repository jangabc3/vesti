package com.vesti.backend.dto.response;

import com.vesti.backend.entity.User;

import lombok.Getter;

@Getter
public class UserResponse {

    private final Long id;
    private final String email;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
    }
}