package com.vesti.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.StylePostCreateRequest;
import com.vesti.backend.dto.request.StylePostUpdateRequest;
import com.vesti.backend.dto.response.StylePostResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.StylePostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/style-posts")
@RequiredArgsConstructor
@Tag(name = "Style Post", description = "스타일 게시물 등록, 조회, 수정, 삭제 API")
public class StylePostController {

    private final StylePostService stylePostService;

    // 스타일 게시물 목록 조회
    @Operation(summary = "스타일 게시물 목록 조회", description = "전체 스타일 게시물을 최신순으로 조회합니다. username을 전달하면 특정 사용자의 게시물만 조회할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "스타일 게시물 목록 조회 성공")
    })
    @GetMapping
    public Page<StylePostResponse> getStylePosts(
            @RequestParam(required = false) String username,
            @ParameterObject Pageable pageable) {

        if (username != null
                && !username.isBlank()) {

            return stylePostService
                    .getStylePostsByUsername(
                            username,
                            pageable);
        }

        return stylePostService
                .getStylePosts(pageable);
    }

    // 스타일 게시물 상세 조회
    @Operation(summary = "스타일 게시물 상세 조회", description = "게시물 ID를 이용하여 특정 스타일 게시물을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "스타일 게시물 조회 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public StylePostResponse getStylePostById(
            @PathVariable Long id) {

        return stylePostService
                .getStylePostById(id);
    }

    // 스타일 게시물 등록
    @Operation(summary = "스타일 게시물 등록", description = "현재 로그인한 사용자가 새로운 스타일 게시물을 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "스타일 게시물 등록 성공"),

            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<StylePostResponse> createStylePost(
            @Valid @RequestBody StylePostCreateRequest request) {

        StylePostResponse response = stylePostService
                .createStylePost(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 스타일 게시물 수정
    @Operation(summary = "스타일 게시물 수정", description = "현재 로그인한 사용자가 자신의 스타일 게시물을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "스타일 게시물 수정 성공"),

            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "403", description = "게시물 수정 권한 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public StylePostResponse updateStylePost(
            @PathVariable Long id,
            @Valid @RequestBody StylePostUpdateRequest request) {

        return stylePostService
                .updateStylePost(
                        id,
                        request);
    }

    // 스타일 게시물 삭제
    @Operation(summary = "스타일 게시물 삭제", description = "현재 로그인한 사용자가 자신의 스타일 게시물을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "스타일 게시물 삭제 성공", content = @Content),

            @ApiResponse(responseCode = "403", description = "게시물 삭제 권한 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStylePost(
            @PathVariable Long id) {

        stylePostService
                .deleteStylePost(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}