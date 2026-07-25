package com.vesti.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.CoordinationClothing;

public interface CoordinationClothingRepository
        extends JpaRepository<CoordinationClothing, Long> {

    List<CoordinationClothing> findByCoordination(Coordination coordination);

    Optional<CoordinationClothing> findByCoordinationAndClothing(
            Coordination coordination,
            Clothing clothing
    );

    void deleteByCoordinationAndClothing(
            Coordination coordination,
            Clothing clothing
    );
}