package com.vesti.backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.vesti.backend.dto.request.CoordinationCreateRequest;
import com.vesti.backend.dto.response.CoordinationResponse;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.CoordinationRepository;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationService {

    private final CoordinationRepository coordinationRepository;
    private final UserRepository userRepository;

    // 코디 등록
    public CoordinationResponse createCoordination(
            CoordinationCreateRequest request) {

        User user = getCurrentUser();

        Coordination coordination = Coordination.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Coordination savedCoordination =
                coordinationRepository.save(coordination);

        return new CoordinationResponse(savedCoordination);
    }

    // 내 코디 목록 조회
    public List<CoordinationResponse> getAllCoordinations() {

        User user = getCurrentUser();

        List<Coordination> coordinationList =
                coordinationRepository.findByUser(user);

        return coordinationList.stream()
                .map(CoordinationResponse::new)
                .toList();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
    }
}