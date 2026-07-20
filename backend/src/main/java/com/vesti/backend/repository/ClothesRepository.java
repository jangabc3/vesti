package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.Clothes;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByCategory(String category);

    List<Clothes> findBySeason(String season);

    List<Clothes> findByColor(String color);
}