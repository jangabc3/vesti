package com.vesti.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.Clothes;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

}