package com.vesti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ClothesUpdateRequest {

    @NotBlank(message = "옷 이름은 필수입니다.")
    private String name;

    @NotBlank(message = "카테고리는 필수입니다.")
    private String category;

    @NotBlank(message = "색상은 필수입니다.")
    private String color;

    @NotBlank(message = "계절은 필수입니다.")
    private String season;
}