package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vesti.backend.entity.Clothes;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByCategory(String category);

    List<Clothes> findBySeason(String season);

    List<Clothes> findByColor(String color);

    List<Clothes> findByCategoryAndSeason(
            String category,
            String season);

    List<Clothes> findByCategoryAndSeasonAndColor(
            String category,
            String season,
            String color);

    @Query("""
        SELECT c
        FROM Clothes c
        WHERE (:category IS NULL OR c.category = :category)
          AND (:season IS NULL OR c.season = :season)
          AND (:color IS NULL OR c.color = :color)
    """)
    List<Clothes> search(
            @Param("category") String category,
            @Param("season") String season,
            @Param("color") String color);
}