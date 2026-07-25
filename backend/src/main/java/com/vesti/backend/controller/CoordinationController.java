package com.vesti.backend.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.vesti.backend.dto.request.CoordinationCreateRequest;
import com.vesti.backend.dto.response.CoordinationResponse;
import com.vesti.backend.service.CoordinationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordinations")
@RequiredArgsConstructor
public class CoordinationController {

    private final CoordinationService coordinationService;

    // 코디 등록
    @PostMapping
    public CoordinationResponse createCoordination(
            @Validated
            @RequestBody CoordinationCreateRequest request) {

        return coordinationService.createCoordination(request);
    }

    // 내 코디 목록 조회
    @GetMapping
    public List<CoordinationResponse> getAllCoordinations() {

        return coordinationService.getAllCoordinations();
    }
}