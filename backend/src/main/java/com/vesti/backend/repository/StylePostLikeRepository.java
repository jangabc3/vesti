package com.vesti.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.StylePostLike;

public interface StylePostLikeRepository
        extends JpaRepository<StylePostLike, Long> {

    boolean existsByStylePost_IdAndUser_Id(
            Long stylePostId,
            Long userId);

    Optional<StylePostLike> findByStylePost_IdAndUser_Id(
            Long stylePostId,
            Long userId);

    long countByStylePost_Id(
            Long stylePostId);

    void deleteAllByStylePost_Id(
            Long stylePostId);
}