package com.vesti.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vesti.backend.dto.request.ClothesCreateRequest;
import com.vesti.backend.dto.request.ClothesUpdateRequest;
import com.vesti.backend.dto.response.ClothesResponse;
import com.vesti.backend.entity.Clothes;
import com.vesti.backend.repository.ClothesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClothesService {

    private final ClothesRepository clothesRepository;

    public ClothesResponse createClothes(ClothesCreateRequest request) {

        Clothes clothes = Clothes.builder()
                .name(request.getName())
                .category(request.getCategory())
                .color(request.getColor())
                .season(request.getSeason())
                .build();

        Clothes savedClothes = clothesRepository.save(clothes);

        return new ClothesResponse(savedClothes);
    }

    public List<ClothesResponse> getAllClothes() {

        List<Clothes> clothesList = clothesRepository.findAll();

        return clothesList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    public List<ClothesResponse> searchByCategory(String category) {

        List<Clothes> clothesList = clothesRepository.findByCategory(category);

        return clothesList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    public List<ClothesResponse> searchBySeason(String season) {

        List<Clothes> clothesList = clothesRepository.findBySeason(season);

        return clothesList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    public List<ClothesResponse> searchByColor(String color) {

        List<Clothes> clothesList = clothesRepository.findByColor(color);

        return clothesList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    public List<ClothesResponse> searchByCategoryAndSeason(
            String category,
            String season) {

        List<Clothes> clothesList = clothesRepository.findByCategoryAndSeason(category, season);

        return clothesList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    public List<ClothesResponse> searchByCategoryAndSeasonAndColor(
        String category,
        String season,
        String color) {

    List<Clothes> clothesList =
            clothesRepository.findByCategoryAndSeasonAndColor(
                    category,
                    season,
                    color);

    return clothesList.stream()
            .map(ClothesResponse::new)
            .toList();
}

    public ClothesResponse getClothesById(Long id) {

        Clothes clothes = clothesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("옷을 찾을 수 없습니다."));

        return new ClothesResponse(clothes);
    }

    public ClothesResponse updateClothes(
            Long id,
            ClothesUpdateRequest request) {

        Clothes clothes = clothesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("옷을 찾을 수 없습니다."));

        clothes.setName(request.getName());
        clothes.setCategory(request.getCategory());
        clothes.setColor(request.getColor());
        clothes.setSeason(request.getSeason());

        Clothes updatedClothes = clothesRepository.save(clothes);

        return new ClothesResponse(updatedClothes);
    }

    public void deleteClothes(Long id) {

        if (!clothesRepository.existsById(id)) {
            throw new RuntimeException("옷을 찾을 수 없습니다.");
        }

        clothesRepository.deleteById(id);
    }
}