package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.User;

public interface ClothingRepository
                extends JpaRepository<Clothing, Long>,
                JpaSpecificationExecutor<Clothing> {

        List<Clothing> findByUser(User user);
}