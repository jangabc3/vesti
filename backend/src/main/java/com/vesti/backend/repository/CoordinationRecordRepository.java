package com.vesti.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.CoordinationRecord;
import com.vesti.backend.entity.User;

public interface CoordinationRecordRepository
        extends JpaRepository<CoordinationRecord, Long> {

    List<CoordinationRecord> findByUserOrderByDateAsc(
            User user);

    List<CoordinationRecord> findByUserAndDateBetweenOrderByDateAsc(
            User user,
            LocalDate startDate,
            LocalDate endDate);

    Optional<CoordinationRecord> findByUserAndDate(
            User user,
            LocalDate date);

    Optional<CoordinationRecord> findByUserAndDateAndIdNot(
            User user,
            LocalDate date,
            Long id);
}
