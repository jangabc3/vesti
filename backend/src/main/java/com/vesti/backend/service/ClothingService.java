package com.vesti.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.vesti.backend.entity.User;
import com.vesti.backend.repository.UserRepository;
import com.vesti.backend.dto.request.ClothesCreateRequest;
import com.vesti.backend.dto.request.ClothesUpdateRequest;
import com.vesti.backend.dto.response.ClothesResponse;
import com.vesti.backend.entity.Clothing;
import com.vesti.backend.repository.ClothingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClothingService {

    private final ClothingRepository clothingRepository;
    private final UserRepository userRepository;

    // 옷 등록
    public ClothesResponse createClothes(ClothesCreateRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Clothing clothing = Clothing.builder()
                .user(user)
                .name(request.getName())
                .category(request.getCategory())
                .color(request.getColor())
                .season(request.getSeason())
                .build();

        Clothing savedClothing = clothingRepository.save(clothing);

        return new ClothesResponse(savedClothing);
    }

    // 전체 옷 조회
    public List<ClothesResponse> getAllClothes() {

        List<Clothing> clothingList = clothingRepository.findAll();

        return clothingList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    // 옷 목록 페이지 조회
    public Page<ClothesResponse> getClothesPage(Pageable pageable) {

        Page<Clothing> clothingPage = clothingRepository.findAll(pageable);

        return clothingPage.map(ClothesResponse::new);
    }

    // 카테고리, 계절, 색상 검색
    public List<ClothesResponse> searchClothes(
            String category,
            String season,
            String color) {

        List<Clothing> clothingList = clothingRepository.search(
                category,
                season,
                color);

        return clothingList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    // 옷 상세 조회
    public ClothesResponse getClothesById(Long id) {

        Clothing clothing = clothingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("옷을 찾을 수 없습니다."));

        return new ClothesResponse(clothing);
    }

    // 옷 수정
    public ClothesResponse updateClothes(
            Long id,
            ClothesUpdateRequest request) {

        Clothing clothing = clothingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("옷을 찾을 수 없습니다."));

        clothing.setName(request.getName());
        clothing.setCategory(request.getCategory());
        clothing.setColor(request.getColor());
        clothing.setSeason(request.getSeason());

        Clothing updatedClothing = clothingRepository.save(clothing);

        return new ClothesResponse(updatedClothing);
    }

    // 옷 삭제
    public void deleteClothes(Long id) {

        if (!clothingRepository.existsById(id)) {
            throw new RuntimeException("옷을 찾을 수 없습니다.");
        }

        clothingRepository.deleteById(id);
    }
}