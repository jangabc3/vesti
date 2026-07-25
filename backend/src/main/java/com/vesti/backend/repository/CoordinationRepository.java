package com.vesti.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vesti.backend.entity.Coordination;
import com.vesti.backend.entity.User;

public interface CoordinationRepository
        extends JpaRepository<Coordination, Long> {

    List<Coordination> findByUser(User user);

}