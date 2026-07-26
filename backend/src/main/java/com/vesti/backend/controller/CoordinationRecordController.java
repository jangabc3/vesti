package com.vesti.backend.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.CoordinationRecordCreateRequest;
import com.vesti.backend.dto.response.CoordinationRecordResponse;
import com.vesti.backend.service.CoordinationRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordination-records")
@RequiredArgsConstructor
public class CoordinationRecordController {

    private final CoordinationRecordService coordinationRecordService;

    // 코디 기록 등록
    @PostMapping
    public CoordinationRecordResponse createCoordinationRecord(
            @Validated @RequestBody CoordinationRecordCreateRequest request) {

        return coordinationRecordService
                .createCoordinationRecord(request);
    }
}