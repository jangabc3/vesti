package com.vesti.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.vesti.backend.dto.request.ClothingCreateRequest;
import com.vesti.backend.dto.request.ClothingUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.service.ClothingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clothes")
@RequiredArgsConstructor
public class ClothingController {

    private final ClothingService clothingService;

    @GetMapping
    public List<ClothingResponse> getAllClothes() {
        return clothingService.getAllClothes();
    }

    @GetMapping("/page")
    public Page<ClothingResponse> getClothesPage(Pageable pageable) {
        return clothingService.getClothesPage(pageable);
    }

    @GetMapping("/search")
    public List<ClothingResponse> searchClothes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String color) {

        return clothingService.searchClothes(
                category,
                season,
                color);
    }

    @GetMapping("/{id}")
    public ClothingResponse getClothesById(
            @PathVariable Long id) {

        return clothingService.getClothesById(id);
    }

    @PostMapping
    public ClothingResponse createClothes(
            @Valid @RequestBody ClothingCreateRequest request) {

        return clothingService.createClothes(request);
    }

    @PutMapping("/{id}")
    public ClothingResponse updateClothes(
            @PathVariable Long id,
            @Valid @RequestBody ClothingUpdateRequest request) {

        return clothingService.updateClothes(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteClothes(
            @PathVariable Long id) {

        clothingService.deleteClothes(id);
    }
}