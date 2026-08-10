package com.vesti.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.vesti.backend.dto.request.CoordinationUpdateRequest;
import com.vesti.backend.dto.request.CoordinationCreateRequest;
import com.vesti.backend.dto.response.CoordinationDetailResponse;
import com.vesti.backend.dto.response.CoordinationResponse;
import com.vesti.backend.service.CoordinationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordinations")
@RequiredArgsConstructor
public class CoordinationController {

    private final CoordinationService coordinationService;

    /*
     * 코디 등록 API
     *
     * POST /api/coordinations
     */
    @PostMapping
    public ResponseEntity<CoordinationResponse> createCoordination(
            @Validated @RequestBody CoordinationCreateRequest request) {

        CoordinationResponse response = coordinationService.createCoordination(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 내 코디 목록 조회
    @GetMapping
    public List<CoordinationResponse> getAllCoordinations() {

        return coordinationService.getAllCoordinations();
    }

    // 코디에 옷 추가
    @PostMapping("/{coordinationId}/clothes/{clothingId}")
    public CoordinationResponse addClothingToCoordination(
            @PathVariable Long coordinationId,
            @PathVariable Long clothingId) {

        return coordinationService.addClothingToCoordination(
                coordinationId,
                clothingId);
    }

    // 코디 상세 조회
    @GetMapping("/{coordinationId}")
    public ResponseEntity<CoordinationDetailResponse> getCoordinationById(
            @PathVariable Long coordinationId) {

        CoordinationDetailResponse response = coordinationService.getCoordinationById(coordinationId);

        return ResponseEntity.ok(response);
    }

    // 코디 수정
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
    @DeleteMapping("/{coordinationId}")
    public ResponseEntity<Void> deleteCoordination(
            @PathVariable Long coordinationId) {

        coordinationService.deleteCoordination(coordinationId);

        return ResponseEntity.noContent().build();
    }
}