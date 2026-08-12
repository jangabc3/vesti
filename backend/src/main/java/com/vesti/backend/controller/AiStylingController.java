package com.vesti.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.AiStylingRequest;
import com.vesti.backend.dto.response.AiStylingResponse;
import com.vesti.backend.service.AiStylingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "VESTI AI", description = "사용자의 실제 옷장을 기반으로 스타일을 추천하는 AI API")
public class AiStylingController {

    private final AiStylingService aiStylingService;

    @Operation(summary = "AI 스타일 추천", description = "현재 로그인 사용자의 실제 옷과 저장된 코디를 기반으로 AI 스타일링을 추천합니다.")
    @PostMapping("/styling")
    public ResponseEntity<AiStylingResponse> recommendStyling(
            @Valid @RequestBody AiStylingRequest request) {

        AiStylingResponse response = aiStylingService.recommend(request);

        return ResponseEntity.ok(response);
    }
}