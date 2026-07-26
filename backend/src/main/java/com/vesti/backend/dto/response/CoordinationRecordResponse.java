package com.vesti.backend.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.vesti.backend.entity.CoordinationRecord;

import lombok.Getter;

@Getter
public class CoordinationRecordResponse {

    private Long id;
    private LocalDate date;
    private Long coordinationId;
    private String coordinationName;
    private LocalDateTime createdAt;

    public CoordinationRecordResponse(
            CoordinationRecord coordinationRecord) {

        this.id = coordinationRecord.getId();
        this.date = coordinationRecord.getDate();
        this.coordinationId = coordinationRecord.getCoordination().getId();
        this.coordinationName = coordinationRecord.getCoordination().getName();
        this.createdAt = coordinationRecord.getCreatedAt();
    }
}