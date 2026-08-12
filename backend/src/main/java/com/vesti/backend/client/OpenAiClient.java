package com.vesti.backend.client;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Component
public class OpenAiClient {

    private final RestClient restClient;
    private final JsonMapper jsonMapper;

    private final String apiKey;
    private final String model;

    public OpenAiClient(
            JsonMapper jsonMapper,
            @Value("${openai.api-key:}") String apiKey,
            @Value("${openai.model:gpt-5}") String model) {

        this.jsonMapper = jsonMapper;

        this.apiKey = apiKey;
        this.model = model;

        var requestFactory = new org.springframework.http.client.JdkClientHttpRequestFactory();

        requestFactory.setReadTimeout(
                java.time.Duration.ofSeconds(60));

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com")
                .requestFactory(requestFactory)
                .build();
    }

    public AiModelResult createStylingRecommendation(
            String userMessage,
            List<WardrobeItem> wardrobe,
            List<CoordinationItem> coordinations) {

        validateApiKey();

        String input = buildInput(
                userMessage,
                wardrobe,
                coordinations);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "instructions", buildInstructions(),
                "input", input,
                "text", Map.of(
                        "format", buildResponseFormat()));

        JsonNode response;

        try {

            response = restClient.post()
                    .uri("/v1/responses")
                    .header(
                            "Authorization",
                            "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

        } catch (org.springframework.web.client.HttpStatusCodeException exception) {

            System.err.println(
                    "===== OPENAI API ERROR =====");

            System.err.println(
                    "STATUS: "
                            + exception.getStatusCode());

            System.err.println(
                    "BODY: "
                            + exception.getResponseBodyAsString());

            System.err.println(
                    "============================");

            throw exception;

        } catch (Exception exception) {

            System.err.println(
                    "===== OPENAI CLIENT ERROR =====");

            System.err.println(
                    exception.getClass().getName());

            System.err.println(
                    exception.getMessage());

            System.err.println(
                    "==============================");

            throw exception;
        }

        String outputText = extractOutputText(response);

        try {
            return jsonMapper.readValue(
                    outputText,
                    AiModelResult.class);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "AI 응답을 JSON으로 변환하지 못했습니다.",
                    exception);
        }
    }

    private void validateApiKey() {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다.");
        }
    }

    private String buildInstructions() {

        return """
                당신은 패션 플랫폼 VESTI의 AI 스타일리스트입니다.

                사용자의 실제 옷장과 실제 저장 코디만 근거로 스타일을 추천합니다.

                반드시 다음 규칙을 지키세요.

                1. recommendedLooks의 coordinationId는 제공된 코디 ID 중에서만 선택합니다.
                2. usedClothes의 clothingId는 제공된 옷 ID 중에서만 선택합니다.
                3. 존재하지 않는 옷 ID나 코디 ID를 만들어내면 안 됩니다.
                4. 사용자의 요청에 가장 잘 맞는 코디를 최대 3개 추천합니다.
                5. 사용자의 옷장에 없는 아이템이 도움이 된다면 missingItems에 일반적인 아이템 이름을 적습니다.
                6. missingItems에는 브랜드명이나 특정 쇼핑몰 상품명을 넣지 않습니다.
                7. 사용자가 이미 가지고 있는 옷은 missingItems에 넣지 않습니다.
                8. 추천 이유는 짧고 이해하기 쉬운 한국어로 작성합니다.
                9. 사용자의 실제 데이터가 부족하면 솔직하게 설명합니다.
                10. 패션 스타일링과 관계없는 질문에는 VESTI 스타일링 범위 안에서 답변합니다.

                title은 추천 결과를 한 문장으로 요약합니다.
                reason은 전체 추천 이유를 2~3문장 이내로 설명합니다.
                """;
    }

    private String buildInput(
            String userMessage,
            List<WardrobeItem> wardrobe,
            List<CoordinationItem> coordinations) {

        StringBuilder builder = new StringBuilder();

        builder.append("사용자 요청:\n");
        builder.append(userMessage);
        builder.append("\n\n");

        builder.append("현재 사용자의 실제 옷장:\n");

        if (wardrobe.isEmpty()) {
            builder.append("- 등록된 옷이 없습니다.\n");

        } else {
            for (WardrobeItem item : wardrobe) {
                builder.append("- clothingId=")
                        .append(item.id())
                        .append(", 이름=")
                        .append(item.name())
                        .append(", 카테고리=")
                        .append(item.category())
                        .append(", 색상=")
                        .append(item.color())
                        .append(", 계절=")
                        .append(item.season())
                        .append("\n");
            }
        }

        builder.append("\n");
        builder.append("현재 사용자가 저장한 실제 코디:\n");

        if (coordinations.isEmpty()) {
            builder.append("- 저장된 코디가 없습니다.\n");

        } else {
            for (CoordinationItem coordination : coordinations) {

                builder.append("- coordinationId=")
                        .append(coordination.id())
                        .append(", 이름=")
                        .append(coordination.name())
                        .append(", 설명=")
                        .append(coordination.description())
                        .append("\n");
            }
        }

        return builder.toString();
    }

    private Map<String, Object> buildResponseFormat() {

        Map<String, Object> recommendedLookItem = Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "coordinationId", Map.of(
                                "type", "integer"),
                        "reason", Map.of(
                                "type", "string")),
                "required", List.of(
                        "coordinationId",
                        "reason"));

        Map<String, Object> usedClothingItem = Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "clothingId", Map.of(
                                "type", "integer")),
                "required", List.of(
                        "clothingId"));

        Map<String, Object> schema = Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "title", Map.of(
                                "type", "string"),

                        "reason", Map.of(
                                "type", "string"),

                        "recommendedLooks", Map.of(
                                "type", "array",
                                "items", recommendedLookItem),

                        "usedClothes", Map.of(
                                "type", "array",
                                "items", usedClothingItem),

                        "missingItems", Map.of(
                                "type", "array",
                                "items", Map.of(
                                        "type", "string"))),

                "required", List.of(
                        "title",
                        "reason",
                        "recommendedLooks",
                        "usedClothes",
                        "missingItems"));

        return Map.of(
                "type", "json_schema",
                "name", "vesti_styling_response",
                "strict", true,
                "schema", schema);
    }

    private String extractOutputText(JsonNode response) {

        if (response == null) {
            throw new IllegalStateException(
                    "OpenAI 응답이 비어 있습니다.");
        }

        JsonNode output = response.path("output");

        if (!output.isArray()) {
            throw new IllegalStateException(
                    "OpenAI 응답에서 output을 찾을 수 없습니다.");
        }

        for (JsonNode outputItem : output) {

            JsonNode contents = outputItem.path("content");

            if (!contents.isArray()) {
                continue;
            }

            for (JsonNode content : contents) {

                if ("output_text".equals(
                        content.path("type").asString())) {

                    String text = content.path("text").asString();

                    if (text != null && !text.isBlank()) {
                        return text;
                    }
                }
            }
        }

        throw new IllegalStateException(
                "OpenAI 응답에서 텍스트 결과를 찾을 수 없습니다.");
    }

    public record WardrobeItem(
            Long id,
            String name,
            String category,
            String color,
            String season) {
    }

    public record CoordinationItem(
            Long id,
            String name,
            String description) {
    }

    public static class AiModelResult {

        private String title;
        private String reason;

        private List<RecommendedLook> recommendedLooks = new ArrayList<>();

        private List<UsedClothing> usedClothes = new ArrayList<>();

        private List<String> missingItems = new ArrayList<>();

        public AiModelResult() {
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public List<RecommendedLook> getRecommendedLooks() {
            return recommendedLooks;
        }

        public void setRecommendedLooks(
                List<RecommendedLook> recommendedLooks) {

            this.recommendedLooks = recommendedLooks;
        }

        public List<UsedClothing> getUsedClothes() {
            return usedClothes;
        }

        public void setUsedClothes(
                List<UsedClothing> usedClothes) {

            this.usedClothes = usedClothes;
        }

        public List<String> getMissingItems() {
            return missingItems;
        }

        public void setMissingItems(
                List<String> missingItems) {

            this.missingItems = missingItems;
        }
    }

    public static class RecommendedLook {

        private Long coordinationId;
        private String reason;

        public RecommendedLook() {
        }

        public Long getCoordinationId() {
            return coordinationId;
        }

        public void setCoordinationId(Long coordinationId) {
            this.coordinationId = coordinationId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public static class UsedClothing {

        private Long clothingId;

        public UsedClothing() {
        }

        public Long getClothingId() {
            return clothingId;
        }

        public void setClothingId(Long clothingId) {
            this.clothingId = clothingId;
        }
    }
}