package com.vesti.backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.dto.request.CoordinationCreateRequest;
import com.vesti.backend.dto.request.CoordinationUpdateRequest;
import com.vesti.backend.dto.response.ClothingResponse;
import com.vesti.backend.dto.response.CoordinationDetailResponse;
import com.vesti.backend.dto.response.CoordinationResponse;
import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.CoordinationClothing;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.ClothingAccessDeniedException;
import com.vesti.backend.exception.ClothingNotFoundException;
import com.vesti.backend.exception.CoordinationAccessDeniedException;
import com.vesti.backend.exception.CoordinationClothingNotFoundException;
import com.vesti.backend.exception.CoordinationNotFoundException;
import com.vesti.backend.exception.DuplicateCoordinationClothingException;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.ClothingRepository;
import com.vesti.backend.repository.CoordinationClothingRepository;
import com.vesti.backend.repository.CoordinationRepository;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationService {

    private final CoordinationRepository coordinationRepository;
    private final UserRepository userRepository;
    private final ClothingRepository clothingRepository;
    private final CoordinationClothingRepository coordinationClothingRepository;

    // 코디 등록
    public CoordinationResponse createCoordination(
            CoordinationCreateRequest request) {

        User user = getCurrentUser();

        Coordination coordination = Coordination.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Coordination savedCoordination = coordinationRepository.save(coordination);

        return new CoordinationResponse(savedCoordination);
    }

    // 내 코디 목록 조회
    public List<CoordinationResponse> getAllCoordinations() {

        User user = getCurrentUser();

        List<Coordination> coordinationList = coordinationRepository.findByUser(user);

        return coordinationList.stream()
                .map(CoordinationResponse::new)
                .toList();
    }

    // 코디 상세 조회
    public CoordinationDetailResponse getCoordinationById(
            Long coordinationId) {

        Coordination coordination = getMyCoordination(coordinationId);

        List<CoordinationClothing> coordinationClothes = coordinationClothingRepository
                .findByCoordination(coordination);

        List<ClothingResponse> clothes = coordinationClothes.stream()
                .map(CoordinationClothing::getClothing)
                .map(ClothingResponse::new)
                .toList();

        return CoordinationDetailResponse.builder()
                .id(coordination.getId())
                .name(coordination.getName())
                .description(coordination.getDescription())
                .createdAt(coordination.getCreatedAt())
                .clothes(clothes)
                .build();
    }

    // 코디 수정
    @Transactional
    public CoordinationResponse updateCoordination(
            Long coordinationId,
            CoordinationUpdateRequest request) {

        Coordination coordination = getMyCoordination(coordinationId);

        coordination.update(
                request.getName(),
                request.getDescription());

        return new CoordinationResponse(coordination);
    }

    // 코디 삭제
    @Transactional
    public void deleteCoordination(Long coordinationId) {

        Coordination coordination = getMyCoordination(coordinationId);

        List<CoordinationClothing> coordinationClothes = coordinationClothingRepository
                .findByCoordination(coordination);

        coordinationClothingRepository.deleteAll(coordinationClothes);

        coordinationRepository.delete(coordination);
    }

    // 코디에 옷 추가
    public CoordinationResponse addClothingToCoordination(
            Long coordinationId,
            Long clothingId) {

        Coordination coordination = getMyCoordination(coordinationId);

        Clothing clothing = clothingRepository.findById(clothingId)
                .orElseThrow(ClothingNotFoundException::new);

        User user = getCurrentUser();

        // 현재 사용자의 옷인지 확인
        if (clothing.getUser() == null
                || !clothing.getUser().getId().equals(user.getId())) {
            throw new ClothingAccessDeniedException();
        }

        boolean alreadyExists = coordinationClothingRepository
                .findByCoordinationAndClothing(
                        coordination,
                        clothing)
                .isPresent();

        // 같은 옷 중복 추가 방지
        if (alreadyExists) {
            throw new DuplicateCoordinationClothingException();
        }

        CoordinationClothing coordinationClothing = CoordinationClothing.builder()
                .coordination(coordination)
                .clothing(clothing)
                .build();

        coordinationClothingRepository.save(coordinationClothing);

        return new CoordinationResponse(coordination);
    }

    // 코디에서 옷 제거
    @Transactional
    public void removeClothingFromCoordination(
            Long coordinationId,
            Long clothingId) {

        Coordination coordination = getMyCoordination(coordinationId);

        Clothing clothing = clothingRepository.findById(clothingId)
                .orElseThrow(ClothingNotFoundException::new);

        User user = getCurrentUser();

        // 현재 사용자의 옷인지 확인
        if (clothing.getUser() == null
                || !clothing.getUser().getId().equals(user.getId())) {
            throw new ClothingAccessDeniedException();
        }

        // 코디에 해당 옷이 포함되어 있는지 확인
        CoordinationClothing coordinationClothing = coordinationClothingRepository
                .findByCoordinationAndClothing(
                        coordination,
                        clothing)
                .orElseThrow(
                        CoordinationClothingNotFoundException::new);

        coordinationClothingRepository.delete(coordinationClothing);
    }

    // 내 코디 조회
    private Coordination getMyCoordination(
            Long coordinationId) {

        Coordination coordination = coordinationRepository.findById(coordinationId)
                .orElseThrow(CoordinationNotFoundException::new);

        User user = getCurrentUser();

        if (coordination.getUser() == null
                || !coordination.getUser().getId().equals(user.getId())) {
            throw new CoordinationAccessDeniedException();
        }

        return coordination;
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