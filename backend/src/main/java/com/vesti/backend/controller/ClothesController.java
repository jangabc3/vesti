package com.vesti.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.vesti.backend.dto.request.ClothesCreateRequest;
import com.vesti.backend.dto.request.ClothesUpdateRequest;
import com.vesti.backend.dto.response.ClothesResponse;
import com.vesti.backend.service.ClothesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clothes")
@RequiredArgsConstructor
public class ClothesController {

    private final ClothesService clothesService;

    @GetMapping
    public List<ClothesResponse> getAllClothes() {
        return clothesService.getAllClothes();
    }

    @GetMapping("/search")
    public List<ClothesResponse> searchByCategory(
            @RequestParam(name = "category") String category) {

        return clothesService.searchByCategory(category);
    }

    @GetMapping("/search/season")
    public List<ClothesResponse> searchBySeason(
            @RequestParam(name = "season") String season) {

        return clothesService.searchBySeason(season);
    }

    @GetMapping("/search/color")
    public List<ClothesResponse> searchByColor(
            @RequestParam(name = "color") String color) {

        return clothesService.searchByColor(color);
    }

    @GetMapping("/{id}")
    public ClothesResponse getClothesById(
            @PathVariable Long id) {

        return clothesService.getClothesById(id);
    }

    @PostMapping
    public ClothesResponse createClothes(
            @Valid @RequestBody ClothesCreateRequest request) {

        return clothesService.createClothes(request);
    }

    @PutMapping("/{id}")
    public ClothesResponse updateClothes(
            @PathVariable Long id,
            @Valid @RequestBody ClothesUpdateRequest request) {

        return clothesService.updateClothes(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteClothes(@PathVariable Long id) {
        clothesService.deleteClothes(id);
    }
}