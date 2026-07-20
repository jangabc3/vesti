package com.vesti.backend.dto.response;

import com.vesti.backend.entity.Clothes;

import lombok.Getter;

@Getter
public class ClothesResponse {

    private Long id;
    private String name;
    private String category;
    private String color;
    private String season;

    public ClothesResponse(Clothes clothes) {
        this.id = clothes.getId();
        this.name = clothes.getName();
        this.category = clothes.getCategory();
        this.color = clothes.getColor();
        this.season = clothes.getSeason();
    }
}