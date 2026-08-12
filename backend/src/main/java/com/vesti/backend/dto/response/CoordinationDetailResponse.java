package com.vesti.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CoordinationDetailResponse {

    private Long id;

    private String name;

    private String description;

    private String occasion;

    private String season;

    private LocalDateTime createdAt;

    private List<ClothingResponse> clothes;
}