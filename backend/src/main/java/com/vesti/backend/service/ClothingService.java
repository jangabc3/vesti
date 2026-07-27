package com.vesti.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.dto.request.ClothingCreateRequest;
import com.vesti.backend.dto.request.ClothingUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.ClothingAccessDeniedException;
import com.vesti.backend.exception.ClothingNotFoundException;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.ClothingRepository;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothingService {

    private final ClothingRepository clothingRepository;
    private final UserRepository userRepository;

    // 옷 등록
    @Transactional
    public ClothingResponse createClothes(
            ClothingCreateRequest request) {

        User user = getCurrentUser();

        Clothing clothing = Clothing.builder()
                .user(user)
                .name(request.getName())
                .category(request.getCategory())
                .color(request.getColor())
                .season(request.getSeason())
                .build();

        Clothing savedClothing = clothingRepository.save(clothing);

        return new ClothingResponse(savedClothing);
    }

    // 전체 옷 조회: 최신 등록순
    public List<ClothingResponse> getAllClothes() {

        User user = getCurrentUser();

        List<Clothing> clothingList = clothingRepository.findByUserOrderByCreatedAtDesc(user);

        return clothingList.stream()
                .map(ClothingResponse::new)
                .toList();
    }

    // 옷 목록 페이지 조회
    public Page<ClothingResponse> getClothesPage(
            Pageable pageable) {

        User user = getCurrentUser();

        Pageable sortedPageable = applyDefaultSort(pageable);

        Page<Clothing> clothingPage = clothingRepository.findByUser(
                user,
                sortedPageable);

        return clothingPage.map(ClothingResponse::new);
    }

    // 카테고리, 계절, 색상 검색: 최신 등록순
    public List<ClothingResponse> searchClothes(
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
                .map(ClothingResponse::new)
                .toList();
    }

    // 옷 상세 조회
    public ClothingResponse getClothesById(
            Long id) {

        Clothing clothing = getMyClothing(id);

        return new ClothingResponse(clothing);
    }

    // 옷 수정
    @Transactional
    public ClothingResponse updateClothes(
            Long id,
            ClothingUpdateRequest request) {

        Clothing clothing = getMyClothing(id);

        clothing.setName(request.getName());
        clothing.setCategory(request.getCategory());
        clothing.setColor(request.getColor());
        clothing.setSeason(request.getSeason());

        return new ClothingResponse(clothing);
    }

    // 옷 삭제
    @Transactional
    public void deleteClothes(Long id) {

        Clothing clothing = getMyClothing(id);

        clothingRepository.delete(clothing);
    }

    // 사용자가 정렬 조건을 보내지 않았을 때 최신 등록순 적용
    private Pageable applyDefaultSort(
            Pageable pageable) {

        if (pageable.getSort().isSorted()) {
            return pageable;
        }

        Sort defaultSort = Sort.by(
                Sort.Direction.DESC,
                "createdAt");

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                defaultSort);
    }

    // 현재 사용자의 옷 조회 및 소유권 확인
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

    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
    }
}