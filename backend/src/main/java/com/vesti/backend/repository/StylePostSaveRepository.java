package com.vesti.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.StylePostSave;

public interface StylePostSaveRepository
        extends JpaRepository<StylePostSave, Long> {

    boolean existsByStylePost_IdAndUser_Id(
            Long stylePostId,
            Long userId);

    Optional<StylePostSave> findByStylePost_IdAndUser_Id(
            Long stylePostId,
            Long userId);

    Page<StylePostSave> findAllByUser_Id(
            Long userId,
            Pageable pageable);

    void deleteAllByStylePost_Id(
            Long stylePostId);
}