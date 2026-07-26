package com.vesti.backend.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.vesti.backend.entity.User;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new UserNotFoundException();
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(UserNotFoundException::new);
    }
}