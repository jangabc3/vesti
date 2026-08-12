package com.vesti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CoordinationCreateRequest {

    @NotBlank(message = "코디 이름은 필수입니다.")
    private String name;

    private String description;

    @NotBlank(message = "상황은 필수입니다.")
    private String occasion;

    @NotBlank(message = "계절은 필수입니다.")
    private String season;
}