package com.vesti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiStylingRequest {

    @NotBlank(message = "스타일링 요청을 입력해주세요.")
    @Size(max = 500, message = "스타일링 요청은 500자 이하로 입력해주세요.")
    private String message;
}