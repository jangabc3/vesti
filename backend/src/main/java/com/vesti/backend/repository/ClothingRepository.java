package com.vesti.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.vesti.backend.entity.Clothing;

public interface ClothingRepository
                extends JpaRepository<Clothing, Long>,
                JpaSpecificationExecutor<Clothing> {
}