package com.vesti.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vesti.backend.dto.request.CoordinationRecordCreateRequest;
import com.vesti.backend.dto.request.CoordinationRecordUpdateRequest;
import com.vesti.backend.dto.response.CoordinationRecordResponse;
import com.vesti.backend.exception.ErrorResponse;
import com.vesti.backend.service.CoordinationRecordService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordination-records")
@RequiredArgsConstructor
@Tag(name = "Coordination Record", description = "코디 착용 기록 등록, 조회, 수정, 삭제 API")
public class CoordinationRecordController {

    private final CoordinationRecordService coordinationRecordService;

    // 코디 기록 등록
    @Operation(summary = "코디 기록 등록", description = "특정 날짜에 착용한 코디를 기록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "코디 기록 등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "해당 코디에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "해당 날짜에 이미 코디 기록이 존재함", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<CoordinationRecordResponse> createCoordinationRecord(
            @Validated @RequestBody CoordinationRecordCreateRequest request) {

        CoordinationRecordResponse response = coordinationRecordService.createCoordinationRecord(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 기간별 코디 기록 조회
    @Operation(summary = "기간별 코디 기록 조회", description = "시작 날짜와 종료 날짜를 기준으로 현재 사용자의 코디 기록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "기간별 코디 기록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "시작 날짜가 종료 날짜보다 늦음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public List<CoordinationRecordResponse> getCoordinationRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return coordinationRecordService.getCoordinationRecords(
                startDate,
                endDate);
    }

    // 오늘의 코디 조회
    @Operation(summary = "오늘의 코디 조회", description = "현재 사용자의 오늘 날짜 코디 기록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "오늘의 코디 조회 성공"),
            @ApiResponse(responseCode = "404", description = "오늘의 코디 기록을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/today")
    public CoordinationRecordResponse getTodayCoordinationRecord() {

        return coordinationRecordService.getTodayCoordinationRecord();
    }

    // 코디 기록 수정
    @Operation(summary = "코디 기록 수정", description = "코디 기록 ID를 이용하여 날짜 또는 코디 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "코디 기록 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "해당 코디 기록 또는 코디에 접근할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디 기록 또는 코디를 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "변경하려는 날짜에 이미 코디 기록이 존재함", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{recordId}")
    public CoordinationRecordResponse updateCoordinationRecord(
            @PathVariable Long recordId,
            @Validated @RequestBody CoordinationRecordUpdateRequest request) {

        return coordinationRecordService.updateCoordinationRecord(
                recordId,
                request);
    }

    // 코디 기록 삭제
    @Operation(summary = "코디 기록 삭제", description = "코디 기록 ID를 이용하여 등록된 코디 기록을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "코디 기록 삭제 성공", content = @Content),
            @ApiResponse(responseCode = "403", description = "해당 코디 기록을 삭제할 권한이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "코디 기록을 찾을 수 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteCoordinationRecord(
            @PathVariable Long recordId) {

        coordinationRecordService.deleteCoordinationRecord(recordId);

        return ResponseEntity.noContent().build();
    }
}