package com.vesti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CoordinationUpdateRequest {

    @NotBlank(message = "코디 이름은 필수입니다.")
    private String name;

    private String description;
}