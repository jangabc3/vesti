package com.vesti.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.StylePostCommentCreateRequest;
import com.vesti.backend.dto.response.StylePostCommentResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.StylePostCommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Style Post Comment", description = "스타일 게시물 댓글 조회, 등록, 삭제 API")
public class StylePostCommentController {

    private final StylePostCommentService stylePostCommentService;

    // 댓글 목록 조회
    @Operation(summary = "댓글 목록 조회", description = "특정 스타일 게시물의 댓글을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공"),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/style-posts/{stylePostId}/comments")
    public List<StylePostCommentResponse> getComments(
            @PathVariable Long stylePostId) {

        return stylePostCommentService
                .getComments(stylePostId);
    }

    // 댓글 등록
    @Operation(summary = "댓글 등록", description = "현재 로그인한 사용자가 특정 스타일 게시물에 댓글을 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "댓글 등록 성공"),

            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "스타일 게시물을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/style-posts/{stylePostId}/comments")
    public ResponseEntity<StylePostCommentResponse> createComment(
            @PathVariable Long stylePostId,
            @Valid @RequestBody StylePostCommentCreateRequest request) {

        StylePostCommentResponse response = stylePostCommentService
                .createComment(
                        stylePostId,
                        request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 댓글 삭제
    @Operation(summary = "댓글 삭제", description = "현재 로그인한 사용자가 자신이 작성한 댓글을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "댓글 삭제 성공", content = @Content),

            @ApiResponse(responseCode = "403", description = "댓글 삭제 권한 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/style-post-comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId) {

        stylePostCommentService
                .deleteComment(commentId);

        return ResponseEntity
                .noContent()
                .build();
    }
}