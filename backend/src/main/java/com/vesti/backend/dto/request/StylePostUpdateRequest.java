package com.vesti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StylePostUpdateRequest {

    @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
    private String title;

    @NotBlank(message = "게시물 내용은 필수입니다.")
    @Size(max = 2000, message = "게시물 내용은 2000자 이하로 입력해주세요.")
    private String caption;

    @NotBlank(message = "게시물 이미지는 필수입니다.")
    @Size(max = 1000, message = "이미지 URL은 1000자 이하이어야 합니다.")
    private String imageUrl;

    @Size(max = 100, message = "위치는 100자 이하로 입력해주세요.")
    private String location;
}