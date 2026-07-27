package com.vesti.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.request.ClothingCreateRequest;
import com.vesti.backend.dto.request.ClothingUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.ClothingAccessDeniedException;
import com.vesti.backend.exception.ClothingNotFoundException;
import com.vesti.backend.repository.ClothingRepository;
import com.vesti.backend.repository.specification.ClothingSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothingService {

    private final ClothingRepository clothingRepository;
    private final CurrentUserProvider currentUserProvider;

    // 옷 등록
    @Transactional
    public ClothingResponse createClothes(
            ClothingCreateRequest request) {

        User user = currentUserProvider.getCurrentUser();

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

    // 검색, 정렬, 페이지네이션 통합 조회
    public Page<ClothingResponse> getClothes(
            String category,
            String season,
            String color,
            Pageable pageable) {

        User user = currentUserProvider.getCurrentUser();

        Pageable sortedPageable = applyDefaultSort(pageable);

        Specification<Clothing> specification =
                ClothingSpecification.belongsTo(user)
                        .and(ClothingSpecification.hasCategory(category))
                        .and(ClothingSpecification.hasSeason(season))
                        .and(ClothingSpecification.hasColor(color));

        Page<Clothing> clothingPage =
                clothingRepository.findAll(
                        specification,
                        sortedPageable);

        return clothingPage.map(ClothingResponse::new);
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
    public void deleteClothes(
            Long id) {

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
    private Clothing getMyClothing(
            Long id) {

        Clothing clothing = clothingRepository.findById(id)
                .orElseThrow(ClothingNotFoundException::new);

        User user = currentUserProvider.getCurrentUser();

        if (clothing.getUser() == null
                || !clothing.getUser().getId().equals(user.getId())) {

            throw new ClothingAccessDeniedException();
        }

        return clothing;
    }
}