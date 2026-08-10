package com.vesti.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "백엔드 서버 상태 확인 API")
public class HealthController {

    @Operation(summary = "서버 상태 확인", description = "VESTI 백엔드 서버가 정상적으로 실행 중인지 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "서버 정상 동작")
    })
    @GetMapping("/health")
    public Map<String, String> health() {

        return Map.of(
                "status", "ok",
                "message", "VESTI backend is running");
    }
}