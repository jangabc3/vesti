package com.vesti.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.UserFollow;

public interface UserFollowRepository
        extends JpaRepository<UserFollow, Long> {

    boolean existsByFollower_IdAndFollowing_Id(
            Long followerId,
            Long followingId);

    Optional<UserFollow> findByFollower_IdAndFollowing_Id(
            Long followerId,
            Long followingId);

    long countByFollowing_Id(
            Long followingId);

    long countByFollower_Id(
            Long followerId);

    Page<UserFollow> findAllByFollowing_Id(
            Long followingId,
            Pageable pageable);

    Page<UserFollow> findAllByFollower_Id(
            Long followerId,
            Pageable pageable);
}