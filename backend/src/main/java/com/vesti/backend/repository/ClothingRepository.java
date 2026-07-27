package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.User;

public interface ClothingRepository extends JpaRepository<Clothing, Long> {

        // 사용자의 옷 전체 조회: 최신 등록순
        List<Clothing> findByUserOrderByCreatedAtDesc(User user);

        // 사용자의 옷 페이지 조회
        Page<Clothing> findByUser(User user, Pageable pageable);

        // 카테고리, 계절, 색상 검색: 최신 등록순
        @Query("""
                        SELECT c
                        FROM Clothing c
                        WHERE c.user = :user
                        AND (:category IS NULL OR c.category = :category)
                        AND (:season IS NULL OR c.season = :season)
                        AND (:color IS NULL OR c.color = :color)
                        ORDER BY c.createdAt DESC
                        """)
        List<Clothing> search(
                        @Param("user") User user,
                        @Param("category") String category,
                        @Param("season") String season,
                        @Param("color") String color);
}