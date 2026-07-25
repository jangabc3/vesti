package com.vesti.backend.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.CoordinationCreateRequest;
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
     *
     * 요청 예시:
     * {
     *   "name": "출근 코디",
     *   "description": "검정 셔츠 + 슬랙스"
     * }
     */
    @PostMapping
    public CoordinationResponse createCoordination(
            @Validated @RequestBody CoordinationCreateRequest request) {

        return coordinationService.createCoordination(request);
    }

    /*
     * 현재 로그인한 사용자의 코디 목록 조회 API
     *
     * GET /api/coordinations
     */
    @GetMapping
    public List<CoordinationResponse> getAllCoordinations() {

        return coordinationService.getAllCoordinations();
    }

    /*
     * 특정 코디에 특정 옷을 추가하는 API
     *
     * POST /api/coordinations/{coordinationId}/clothes/{clothingId}
     *
     * 예시:
     * POST /api/coordinations/1/clothes/3
     *
     * coordinationId = 코디 번호
     * clothingId = 옷 번호
     *
     * 요청 본문은 필요하지 않다.
     */
    @PostMapping("/{coordinationId}/clothes/{clothingId}")
    public CoordinationResponse addClothingToCoordination(
            @PathVariable Long coordinationId,
            @PathVariable Long clothingId) {

        return coordinationService.addClothingToCoordination(
                coordinationId,
                clothingId);
    }
}