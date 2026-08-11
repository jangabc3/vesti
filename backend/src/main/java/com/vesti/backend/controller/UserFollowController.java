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

import com.vesti.backend.dto.response.UserFollowStatusResponse;
import com.vesti.backend.dto.response.UserFollowUserResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.UserFollowService;

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
@Tag(name = "User Follow", description = "사용자 팔로우, 언팔로우, 팔로워 및 팔로잉 조회 API")
public class UserFollowController {

    private final UserFollowService userFollowService;

    // 팔로우
    @Operation(summary = "사용자 팔로우", description = "현재 로그인한 사용자가 다른 사용자를 팔로우합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "팔로우 성공"),

            @ApiResponse(responseCode = "400", description = "자기 자신을 팔로우할 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{username}/follow")
    public UserFollowStatusResponse follow(
            @PathVariable String username) {

        return userFollowService
                .follow(username);
    }

    // 팔로우 취소
    @Operation(summary = "사용자 팔로우 취소", description = "현재 로그인한 사용자가 다른 사용자의 팔로우를 취소합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "팔로우 취소 성공"),

            @ApiResponse(responseCode = "400", description = "자기 자신을 대상으로 할 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{username}/follow")
    public UserFollowStatusResponse unfollow(
            @PathVariable String username) {

        return userFollowService
                .unfollow(username);
    }

    // 내 팔로우 상태
    @Operation(summary = "내 팔로우 상태 조회", description = "현재 로그인한 사용자가 특정 사용자를 팔로우하고 있는지와 팔로워, 팔로잉 수를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "팔로우 상태 조회 성공"),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{username}/follow/me")
    public UserFollowStatusResponse getMyFollowStatus(
            @PathVariable String username) {

        return userFollowService
                .getMyFollowStatus(username);
    }

    // 팔로워 목록
    @Operation(summary = "팔로워 목록 조회", description = "특정 사용자를 팔로우하는 사용자 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "팔로워 목록 조회 성공"),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{username}/followers")
    public Page<UserFollowUserResponse> getFollowers(
            @PathVariable String username,
            @ParameterObject Pageable pageable) {

        return userFollowService
                .getFollowers(
                        username,
                        pageable);
    }

    // 팔로잉 목록
    @Operation(summary = "팔로잉 목록 조회", description = "특정 사용자가 팔로우하는 사용자 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "팔로잉 목록 조회 성공"),

            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{username}/following")
    public Page<UserFollowUserResponse> getFollowing(
            @PathVariable String username,
            @ParameterObject Pageable pageable) {

        return userFollowService
                .getFollowing(
                        username,
                        pageable);
    }
}