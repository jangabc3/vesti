package com.vesti.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.response.StylePostResponse;
import com.vesti.backend.dto.response.StylePostSaveResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.StylePostSaveService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Style Post Save", description = "스타일 게시물 저장, 저장 취소, 저장 목록 조회 API")
public class StylePostSaveController {

    private final StylePostSaveService stylePostSaveService;

    // 스타일 게시물 저장
    @Operation(summary = "스타일 게시물 저장", description = "현재 로그인한 사용자가 스타일 게시물을 저장합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "스타일 게시물 저장 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/style-posts/{stylePostId}/saves")
    public StylePostSaveResponse saveStylePost(
            @PathVariable Long stylePostId) {

        return stylePostSaveService
                .saveStylePost(stylePostId);
    }

    // 스타일 게시물 저장 취소
    @Operation(summary = "스타일 게시물 저장 취소", description = "현재 로그인한 사용자가 스타일 게시물 저장을 취소합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "스타일 게시물 저장 취소 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/style-posts/{stylePostId}/saves")
    public StylePostSaveResponse unsaveStylePost(
            @PathVariable Long stylePostId) {

        return stylePostSaveService
                .unsaveStylePost(stylePostId);
    }

    // 내 저장 상태 조회
    @Operation(summary = "내 저장 상태 조회", description = "현재 로그인한 사용자가 해당 스타일 게시물을 저장했는지 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "저장 상태 조회 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/style-posts/{stylePostId}/saves/me")
    public StylePostSaveResponse getMySaveStatus(
            @PathVariable Long stylePostId) {

        return stylePostSaveService
                .getMySaveStatus(stylePostId);
    }

    // 내가 저장한 게시물 목록
    @Operation(summary = "내가 저장한 스타일 게시물 목록", description = "현재 로그인한 사용자가 저장한 스타일 게시물을 최신 저장순으로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "저장 게시물 목록 조회 성공")
    })
    @GetMapping("/users/me/saved-style-posts")
    public Page<StylePostResponse> getMySavedStylePosts(
            @ParameterObject Pageable pageable) {

        return stylePostSaveService
                .getMySavedStylePosts(pageable);
    }
}