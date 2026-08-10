package com.vesti.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vesti.backend.dto.request.ClothingCreateRequest;
import com.vesti.backend.dto.request.ClothingUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.ClothingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clothes")
@RequiredArgsConstructor
@Tag(name = "Clothing", description = "옷 등록, 조회, 검색, 수정, 삭제 API")
public class ClothingController {

    private final ClothingService clothingService;

    // 옷 목록 조회
    // 검색, 정렬, 페이지네이션을 한 번에 처리
    @Operation(summary = "옷 목록 조회", description = "현재 사용자의 옷 목록을 조회합니다. 카테고리, 계절, 색상으로 검색할 수 있으며 정렬과 페이지네이션을 지원합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "옷 목록 조회 성공")
    })
    @GetMapping
    public Page<ClothingResponse> getClothes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String color,
            @ParameterObject Pageable pageable) {

        return clothingService.getClothes(
                category,
                season,
                color,
                pageable);
    }

    // 옷 상세 조회
    @Operation(summary = "옷 상세 조회", description = "옷 ID를 이용하여 특정 옷의 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "옷 상세 조회 성공"),
            @ApiResponse(responseCode = "403", description = "해당 옷에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "옷을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ClothingResponse getClothesById(
            @PathVariable Long id) {

        return clothingService.getClothesById(id);
    }

    // 옷 등록
    @Operation(summary = "옷 등록", description = "이름, 카테고리, 색상, 계절 등의 정보를 입력하여 새로운 옷을 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "옷 등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ClothingResponse> createClothes(
            @Valid @RequestBody ClothingCreateRequest request) {

        ClothingResponse response = clothingService.createClothes(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 옷 수정
    @Operation(summary = "옷 수정", description = "옷 ID를 이용하여 기존 옷 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "옷 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "해당 옷을 수정할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "옷을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ClothingResponse updateClothes(
            @PathVariable Long id,
            @Valid @RequestBody ClothingUpdateRequest request) {

        return clothingService.updateClothes(
                id,
                request);
    }

    // 옷 삭제
    @Operation(summary = "옷 삭제", description = "옷 ID를 이용하여 등록된 옷을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "옷 삭제 성공", content = @Content),
            @ApiResponse(responseCode = "403", description = "해당 옷을 삭제할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "옷을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClothes(
            @PathVariable Long id) {

        clothingService.deleteClothes(id);

        return ResponseEntity.noContent().build();
    }
}