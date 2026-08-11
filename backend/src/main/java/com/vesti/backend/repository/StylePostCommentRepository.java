package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.StylePostComment;

public interface StylePostCommentRepository
        extends JpaRepository<StylePostComment, Long> {

    List<StylePostComment> findAllByStylePost_IdOrderByCreatedAtAsc(
            Long stylePostId);

    long countByStylePost_Id(
            Long stylePostId);

    void deleteAllByStylePost_Id(
            Long stylePostId);
}