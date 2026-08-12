package com.vesti.backend.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AiStylingResponse {

    private String message;

    private String title;

    private String reason;

    private List<RecommendedLookResponse> recommendedLooks;

    private List<UsedClothingResponse> usedClothes;

    private List<String> missingItems;

    @Getter
    @Builder
    public static class RecommendedLookResponse {

        private Long coordinationId;

        private String name;

        private String reason;
    }

    @Getter
    @Builder
    public static class UsedClothingResponse {

        private Long clothingId;

        private String name;

        private String category;

        private String color;

        private String season;

        private String imageUrl;
    }
}