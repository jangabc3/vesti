package com.vesti.backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.response.StylePostLikeResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.StylePostLikeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/style-posts")
@RequiredArgsConstructor
@Tag(name = "Style Post Like", description = "스타일 게시물 좋아요 등록, 취소, 상태 조회 API")
public class StylePostLikeController {

    private final StylePostLikeService stylePostLikeService;

    // 좋아요 등록
    @Operation(summary = "스타일 게시물 좋아요", description = "현재 로그인한 사용자가 스타일 게시물에 좋아요를 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 등록 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{stylePostId}/likes")
    public StylePostLikeResponse likeStylePost(
            @PathVariable Long stylePostId) {

        return stylePostLikeService
                .likeStylePost(stylePostId);
    }

    // 좋아요 취소
    @Operation(summary = "스타일 게시물 좋아요 취소", description = "현재 로그인한 사용자가 스타일 게시물의 좋아요를 취소합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 취소 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{stylePostId}/likes")
    public StylePostLikeResponse unlikeStylePost(
            @PathVariable Long stylePostId) {

        return stylePostLikeService
                .unlikeStylePost(stylePostId);
    }

    // 내 좋아요 상태 조회
    @Operation(summary = "내 좋아요 상태 조회", description = "현재 로그인한 사용자가 해당 게시물을 좋아요했는지와 총 좋아요 수를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 상태 조회 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{stylePostId}/likes/me")
    public StylePostLikeResponse getMyLikeStatus(
            @PathVariable Long stylePostId) {

        return stylePostLikeService
                .getMyLikeStatus(stylePostId);
    }
}