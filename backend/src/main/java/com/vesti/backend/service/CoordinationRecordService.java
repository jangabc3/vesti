package com.vesti.backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.dto.request.CoordinationRecordCreateRequest;
import com.vesti.backend.dto.response.CoordinationRecordResponse;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.CoordinationRecord;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.CoordinationAccessDeniedException;
import com.vesti.backend.exception.CoordinationNotFoundException;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.CoordinationRecordRepository;
import com.vesti.backend.repository.CoordinationRepository;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationRecordService {

        private final CoordinationRecordRepository coordinationRecordRepository;
        private final CoordinationRepository coordinationRepository;
        private final UserRepository userRepository;

        // 코디 기록 등록
        @Transactional
        public CoordinationRecordResponse createCoordinationRecord(
                        CoordinationRecordCreateRequest request) {

                User user = getCurrentUser();

                Coordination coordination = coordinationRepository
                                .findById(request.getCoordinationId())
                                .orElseThrow(CoordinationNotFoundException::new);

                // 현재 사용자의 코디인지 확인
                if (coordination.getUser() == null
                                || !coordination.getUser().getId().equals(user.getId())) {
                        throw new CoordinationAccessDeniedException();
                }

                CoordinationRecord coordinationRecord = CoordinationRecord.builder()
                                .date(request.getDate())
                                .user(user)
                                .coordination(coordination)
                                .build();

                CoordinationRecord savedCoordinationRecord = coordinationRecordRepository.save(coordinationRecord);

                return new CoordinationRecordResponse(savedCoordinationRecord);
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