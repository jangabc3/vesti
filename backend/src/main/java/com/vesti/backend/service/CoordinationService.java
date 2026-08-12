package com.vesti.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
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
import com.vesti.backend.repository.ClothingRepository;
import com.vesti.backend.repository.CoordinationClothingRepository;
import com.vesti.backend.repository.CoordinationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoordinationService {

        private final CoordinationRepository coordinationRepository;
        private final ClothingRepository clothingRepository;
        private final CoordinationClothingRepository coordinationClothingRepository;
        private final CurrentUserProvider currentUserProvider;

        @Transactional
        public CoordinationResponse createCoordination(
                        CoordinationCreateRequest request) {

                User user = currentUserProvider.getCurrentUser();

                Coordination coordination = Coordination.builder()
                                .user(user)
                                .name(request.getName())
                                .description(request.getDescription())
                                .occasion(request.getOccasion())
                                .season(request.getSeason())
                                .build();

                Coordination savedCoordination = coordinationRepository.save(coordination);

                return new CoordinationResponse(savedCoordination);
        }

        public List<CoordinationResponse> getAllCoordinations() {

                User user = currentUserProvider.getCurrentUser();

                List<Coordination> coordinationList = coordinationRepository.findByUser(user);

                return coordinationList.stream()
                                .map(CoordinationResponse::new)
                                .toList();
        }

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
                                .occasion(coordination.getOccasion())
                                .season(coordination.getSeason())
                                .createdAt(coordination.getCreatedAt())
                                .clothes(clothes)
                                .build();
        }

        @Transactional
        public CoordinationResponse updateCoordination(
                        Long coordinationId,
                        CoordinationUpdateRequest request) {

                Coordination coordination = getMyCoordination(coordinationId);

                coordination.update(
                                request.getName(),
                                request.getDescription(),
                                request.getOccasion(),
                                request.getSeason());

                return new CoordinationResponse(coordination);
        }

        @Transactional
        public void deleteCoordination(
                        Long coordinationId) {

                Coordination coordination = getMyCoordination(coordinationId);

                List<CoordinationClothing> coordinationClothes = coordinationClothingRepository
                                .findByCoordination(coordination);

                coordinationClothingRepository
                                .deleteAll(coordinationClothes);

                coordinationRepository.delete(coordination);
        }

        @Transactional
        public CoordinationResponse addClothingToCoordination(
                        Long coordinationId,
                        Long clothingId) {

                Coordination coordination = getMyCoordination(coordinationId);

                Clothing clothing = clothingRepository
                                .findById(clothingId)
                                .orElseThrow(
                                                ClothingNotFoundException::new);

                User user = currentUserProvider.getCurrentUser();

                if (clothing.getUser() == null
                                || !clothing.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new ClothingAccessDeniedException();
                }

                boolean alreadyExists = coordinationClothingRepository
                                .findByCoordinationAndClothing(
                                                coordination,
                                                clothing)
                                .isPresent();

                if (alreadyExists) {
                        throw new DuplicateCoordinationClothingException();
                }

                CoordinationClothing coordinationClothing = CoordinationClothing.builder()
                                .coordination(coordination)
                                .clothing(clothing)
                                .build();

                coordinationClothingRepository
                                .save(coordinationClothing);

                return new CoordinationResponse(coordination);
        }

        @Transactional
        public void removeClothingFromCoordination(
                        Long coordinationId,
                        Long clothingId) {

                Coordination coordination = getMyCoordination(coordinationId);

                Clothing clothing = clothingRepository
                                .findById(clothingId)
                                .orElseThrow(
                                                ClothingNotFoundException::new);

                User user = currentUserProvider.getCurrentUser();

                if (clothing.getUser() == null
                                || !clothing.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new ClothingAccessDeniedException();
                }

                CoordinationClothing coordinationClothing = coordinationClothingRepository
                                .findByCoordinationAndClothing(
                                                coordination,
                                                clothing)
                                .orElseThrow(
                                                CoordinationClothingNotFoundException::new);

                coordinationClothingRepository
                                .delete(coordinationClothing);
        }

        private Coordination getMyCoordination(
                        Long coordinationId) {

                Coordination coordination = coordinationRepository
                                .findById(coordinationId)
                                .orElseThrow(
                                                CoordinationNotFoundException::new);

                User user = currentUserProvider.getCurrentUser();

                if (coordination.getUser() == null
                                || !coordination.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new CoordinationAccessDeniedException();
                }

                return coordination;
        }
}