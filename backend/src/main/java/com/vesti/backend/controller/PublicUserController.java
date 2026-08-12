package com.vesti.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.response.PublicUserResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.PublicUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Public User", description = "공개 사용자 프로필 조회 API")
public class PublicUserController {

    private final PublicUserService publicUserService;

    @Operation(summary = "공개 사용자 프로필 조회", description = "username으로 사용자의 공개 프로필 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "사용자 조회 성공"),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{username}")
    public PublicUserResponse getUser(
            @PathVariable String username) {

        return publicUserService
                .getUserByUsername(username);
    }
}