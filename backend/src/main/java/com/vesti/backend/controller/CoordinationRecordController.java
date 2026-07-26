package com.vesti.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.vesti.backend.dto.request.CoordinationRecordUpdateRequest;
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

    // 기간별 코디 기록 조회
    @GetMapping
    public List<CoordinationRecordResponse> getCoordinationRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return coordinationRecordService.getCoordinationRecords(
                startDate,
                endDate);
    }

    // 오늘의 코디 조회
    @GetMapping("/today")
    public CoordinationRecordResponse getTodayCoordinationRecord() {

        return coordinationRecordService.getTodayCoordinationRecord();
    }

    // 코디 기록 수정
    @PutMapping("/{recordId}")
    public CoordinationRecordResponse updateCoordinationRecord(
            @PathVariable Long recordId,
            @Validated @RequestBody CoordinationRecordUpdateRequest request) {

        return coordinationRecordService.updateCoordinationRecord(
                recordId,
                request);
    }

    // 코디 기록 삭제
    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteCoordinationRecord(
            @PathVariable Long recordId) {

        coordinationRecordService.deleteCoordinationRecord(recordId);

        return ResponseEntity.noContent().build();
    }

}