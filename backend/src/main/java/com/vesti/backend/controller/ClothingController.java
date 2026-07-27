package com.vesti.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.vesti.backend.dto.request.ClothingCreateRequest;
import com.vesti.backend.dto.request.ClothingUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.service.ClothingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clothes")
@RequiredArgsConstructor
public class ClothingController {

    private final ClothingService clothingService;

    // 옷 목록 조회
    // 검색, 정렬, 페이지네이션을 한 번에 처리
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
    @GetMapping("/{id}")
    public ClothingResponse getClothesById(
            @PathVariable Long id) {

        return clothingService.getClothesById(id);
    }

    // 옷 등록
    @PostMapping
    public ClothingResponse createClothes(
            @Valid @RequestBody ClothingCreateRequest request) {

        return clothingService.createClothes(request);
    }

    // 옷 수정
    @PutMapping("/{id}")
    public ClothingResponse updateClothes(
            @PathVariable Long id,
            @Valid @RequestBody ClothingUpdateRequest request) {

        return clothingService.updateClothes(
                id,
                request);
    }

    // 옷 삭제
    @DeleteMapping("/{id}")
    public void deleteClothes(
            @PathVariable Long id) {

        clothingService.deleteClothes(id);
    }
}