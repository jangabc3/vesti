package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vesti.backend.entity.Clothing;

public interface ClothingRepository extends JpaRepository<Clothing, Long> {

        @Query("""
                                SELECT c
                                FROM Clothing c
                                WHERE (:category IS NULL OR c.category = :category)
                                AND (:season IS NULL OR c.season = :season)
                                AND (:color IS NULL OR c.color = :color)
                        """)
        List<Clothing> search(
                        @Param("category") String category,
                        @Param("season") String season,
                        @Param("color") String color);
}