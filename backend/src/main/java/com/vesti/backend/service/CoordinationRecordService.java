package com.vesti.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vesti.backend.dto.request.CoordinationRecordCreateRequest;
import com.vesti.backend.dto.request.CoordinationRecordUpdateRequest;
import com.vesti.backend.dto.response.CoordinationRecordResponse;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.CoordinationRecord;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.CoordinationAccessDeniedException;
import com.vesti.backend.exception.CoordinationNotFoundException;
import com.vesti.backend.exception.CoordinationRecordAccessDeniedException;
import com.vesti.backend.exception.CoordinationRecordNotFoundException;
import com.vesti.backend.exception.DuplicateCoordinationRecordException;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.exception.InvalidDateRangeException;
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

                // 같은 날짜의 기록이 이미 있는지 확인
                coordinationRecordRepository
                                .findByUserAndDate(
                                                user,
                                                request.getDate())
                                .ifPresent(record -> {
                                        throw new DuplicateCoordinationRecordException();
                                });

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

        // 기간별 코디 기록 조회
        @Transactional(readOnly = true)
        public List<CoordinationRecordResponse> getCoordinationRecords(
                        LocalDate startDate,
                        LocalDate endDate) {

                validateDateRange(startDate, endDate);

                User user = getCurrentUser();

                List<CoordinationRecord> records = coordinationRecordRepository
                                .findByUserAndDateBetweenOrderByDateAsc(
                                                user,
                                                startDate,
                                                endDate);

                return records.stream()
                                .map(CoordinationRecordResponse::new)
                                .toList();
        }

        // 코디 기록 수정
        @Transactional
        public CoordinationRecordResponse updateCoordinationRecord(
                        Long recordId,
                        CoordinationRecordUpdateRequest request) {

                User user = getCurrentUser();

                CoordinationRecord record = coordinationRecordRepository
                                .findById(recordId)
                                .orElseThrow(CoordinationRecordNotFoundException::new);

                // 현재 사용자의 기록인지 확인
                if (record.getUser() == null
                                || !record.getUser().getId().equals(user.getId())) {
                        throw new CoordinationRecordAccessDeniedException();
                }

                // 다른 기록과 날짜가 중복되는지 확인
                coordinationRecordRepository
                                .findByUserAndDateAndIdNot(
                                                user,
                                                request.getDate(),
                                                record.getId())
                                .ifPresent(existing -> {
                                        throw new DuplicateCoordinationRecordException();
                                });

                Coordination coordination = coordinationRepository
                                .findById(request.getCoordinationId())
                                .orElseThrow(CoordinationNotFoundException::new);

                // 현재 사용자의 코디인지 확인
                if (coordination.getUser() == null
                                || !coordination.getUser().getId().equals(user.getId())) {
                        throw new CoordinationAccessDeniedException();
                }

                record.update(
                                request.getDate(),
                                coordination);

                return new CoordinationRecordResponse(record);
        }

        // 코디 기록 삭제
        @Transactional
        public void deleteCoordinationRecord(Long recordId) {

                User user = getCurrentUser();

                CoordinationRecord record = coordinationRecordRepository
                                .findById(recordId)
                                .orElseThrow(CoordinationRecordNotFoundException::new);

                // 현재 사용자의 기록인지 확인
                if (record.getUser() == null
                                || !record.getUser().getId().equals(user.getId())) {
                        throw new CoordinationRecordAccessDeniedException();
                }

                coordinationRecordRepository.delete(record);
        }

        // 오늘의 코디 조회
        @Transactional(readOnly = true)
        public CoordinationRecordResponse getTodayCoordinationRecord() {

                User user = getCurrentUser();

                CoordinationRecord record = coordinationRecordRepository
                                .findByUserAndDate(
                                                user,
                                                LocalDate.now())
                                .orElseThrow(CoordinationRecordNotFoundException::new);

                return new CoordinationRecordResponse(record);
        }

        // 날짜 범위 검증
        private void validateDateRange(
                        LocalDate startDate,
                        LocalDate endDate) {

                if (startDate.isAfter(endDate)) {
                        throw new InvalidDateRangeException();
                }
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