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
    private LocalDateTime createdAt;

    // 코디에 포함된 옷 목록
    private List<ClothingResponse> clothes;
}