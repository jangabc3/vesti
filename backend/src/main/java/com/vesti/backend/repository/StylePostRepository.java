package com.vesti.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.StylePost;

public interface StylePostRepository
        extends JpaRepository<StylePost, Long> {

    Page<StylePost> findAllByUser_Username(
            String username,
            Pageable pageable);
}