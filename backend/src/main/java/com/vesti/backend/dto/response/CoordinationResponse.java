package com.vesti.backend.dto.response;

import java.time.LocalDateTime;

import com.vesti.backend.entity.Coordination;

import lombok.Getter;

@Getter
public class CoordinationResponse {

    private final Long id;
    private final String name;
    private final String description;
    private final LocalDateTime createdAt;

    public CoordinationResponse(Coordination coordination) {
        this.id = coordination.getId();
        this.name = coordination.getName();
        this.description = coordination.getDescription();
        this.createdAt = coordination.getCreatedAt();
    }
}