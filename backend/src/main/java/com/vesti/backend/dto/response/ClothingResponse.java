package com.vesti.backend.dto.response;

import com.vesti.backend.entity.Clothing;

import lombok.Getter;

@Getter
public class ClothingResponse {

    private Long id;
    private String name;
    private String category;
    private String color;
    private String season;

    public ClothingResponse(Clothing clothing) {
        this.id = clothing.getId();
        this.name = clothing.getName();
        this.category = clothing.getCategory();
        this.color = clothing.getColor();
        this.season = clothing.getSeason();
    }
}