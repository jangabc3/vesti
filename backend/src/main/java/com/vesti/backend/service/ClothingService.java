package com.vesti.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.vesti.backend.exception.ClothingAccessDeniedException;
import com.vesti.backend.exception.ClothingNotFoundException;
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

        User user = getCurrentUser();

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

        User user = getCurrentUser();

        List<Clothing> clothingList = clothingRepository.findByUser(user);

        return clothingList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    // 옷 목록 페이지 조회
    public Page<ClothesResponse> getClothesPage(Pageable pageable) {

        User user = getCurrentUser();

        Page<Clothing> clothingPage = clothingRepository.findByUser(user, pageable);

        return clothingPage.map(ClothesResponse::new);
    }

    // 카테고리, 계절, 색상 검색
    public List<ClothesResponse> searchClothes(
            String category,
            String season,
            String color) {

        User user = getCurrentUser();

        List<Clothing> clothingList = clothingRepository.search(
                user,
                category,
                season,
                color);

        return clothingList.stream()
                .map(ClothesResponse::new)
                .toList();
    }

    // 옷 상세 조회
    public ClothesResponse getClothesById(Long id) {

        Clothing clothing = getMyClothing(id);

        return new ClothesResponse(clothing);
    }

    // 옷 수정
    public ClothesResponse updateClothes(
            Long id,
            ClothesUpdateRequest request) {

        Clothing clothing = getMyClothing(id);

        clothing.setName(request.getName());
        clothing.setCategory(request.getCategory());
        clothing.setColor(request.getColor());
        clothing.setSeason(request.getSeason());

        Clothing updatedClothing = clothingRepository.save(clothing);

        return new ClothesResponse(updatedClothing);
    }

    // 옷 삭제
    public void deleteClothes(Long id) {

        Clothing clothing = getMyClothing(id);

        clothingRepository.delete(clothing);
    }

    private Clothing getMyClothing(Long id) {

        Clothing clothing = clothingRepository.findById(id)
                .orElseThrow(ClothingNotFoundException::new);

        User user = getCurrentUser();

        if (clothing.getUser() == null
                || !clothing.getUser().getId().equals(user.getId())) {
            throw new ClothingAccessDeniedException();
        }

        return clothing;
    }

    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

}