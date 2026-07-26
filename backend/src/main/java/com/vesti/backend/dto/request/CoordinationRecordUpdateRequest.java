package com.vesti.backend.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CoordinationRecordUpdateRequest {

    @NotNull(message = "날짜는 필수입니다.")
    private LocalDate date;

    @NotNull(message = "코디는 필수입니다.")
    private Long coordinationId;
}