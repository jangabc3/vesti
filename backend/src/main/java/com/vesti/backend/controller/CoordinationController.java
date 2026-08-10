package com.vesti.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.CoordinationCreateRequest;
import com.vesti.backend.dto.request.CoordinationUpdateRequest;
import com.vesti.backend.dto.response.CoordinationDetailResponse;
import com.vesti.backend.dto.response.CoordinationResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.CoordinationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordinations")
@RequiredArgsConstructor
@Tag(name = "Coordination", description = "코디 등록, 조회, 수정, 삭제 및 코디에 옷을 추가하거나 제거하는 API")
public class CoordinationController {

    private final CoordinationService coordinationService;

    // 코디 등록
    @Operation(summary = "코디 등록", description = "코디 이름과 설명을 입력하여 새로운 코디를 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "코디 등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<CoordinationResponse> createCoordination(
            @Validated @RequestBody CoordinationCreateRequest request) {

        CoordinationResponse response = coordinationService.createCoordination(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 내 코디 목록 조회
    @Operation(summary = "코디 목록 조회", description = "현재 로그인한 사용자가 등록한 코디 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "코디 목록 조회 성공")
    })
    @GetMapping
    public List<CoordinationResponse> getAllCoordinations() {

        return coordinationService.getAllCoordinations();
    }

    // 코디에 옷 추가
    @Operation(summary = "코디에 옷 추가", description = "코디 ID와 옷 ID를 이용하여 특정 코디에 옷을 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "코디에 옷 추가 성공"),
            @ApiResponse(responseCode = "403", description = "해당 코디 또는 옷에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디 또는 옷을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "이미 코디에 포함된 옷", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{coordinationId}/clothes/{clothingId}")
    public CoordinationResponse addClothingToCoordination(
            @PathVariable Long coordinationId,
            @PathVariable Long clothingId) {

        return coordinationService.addClothingToCoordination(
                coordinationId,
                clothingId);
    }

    // 코디 상세 조회
    @Operation(summary = "코디 상세 조회", description = "코디 ID를 이용하여 코디와 포함된 옷 정보를 상세 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "코디 상세 조회 성공"),
            @ApiResponse(responseCode = "403", description = "해당 코디에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{coordinationId}")
    public ResponseEntity<CoordinationDetailResponse> getCoordinationById(
            @PathVariable Long coordinationId) {

        CoordinationDetailResponse response = coordinationService.getCoordinationById(coordinationId);

        return ResponseEntity.ok(response);
    }

    // 코디 수정
    @Operation(summary = "코디 수정", description = "코디 ID를 이용하여 코디 이름이나 설명을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "코디 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "해당 코디를 수정할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{coordinationId}")
    public ResponseEntity<CoordinationResponse> updateCoordination(
            @PathVariable Long coordinationId,
            @Validated @RequestBody CoordinationUpdateRequest request) {

        CoordinationResponse response = coordinationService.updateCoordination(
                coordinationId,
                request);

        return ResponseEntity.ok(response);
    }

    // 코디에서 옷 제거
    @Operation(summary = "코디에서 옷 제거", description = "코디 ID와 옷 ID를 이용하여 코디에 포함된 옷을 제거합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "코디에서 옷 제거 성공", content = @Content),
            @ApiResponse(responseCode = "403", description = "해당 코디 또는 옷에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디, 옷 또는 코디에 포함된 옷 관계를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{coordinationId}/clothes/{clothingId}")
    public ResponseEntity<Void> removeClothingFromCoordination(
            @PathVariable Long coordinationId,
            @PathVariable Long clothingId) {

        coordinationService.removeClothingFromCoordination(
                coordinationId,
                clothingId);

        return ResponseEntity.noContent().build();
    }

    // 코디 삭제
    @Operation(summary = "코디 삭제", description = "코디 ID를 이용하여 등록된 코디를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "코디 삭제 성공", content = @Content),
            @ApiResponse(responseCode = "403", description = "해당 코디를 삭제할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{coordinationId}")
    public ResponseEntity<Void> deleteCoordination(
            @PathVariable Long coordinationId) {

        coordinationService.deleteCoordination(coordinationId);

        return ResponseEntity.noContent().build();
    }
}