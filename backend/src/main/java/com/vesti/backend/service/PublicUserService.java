package com.vesti.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.dto.response.PublicUserResponse;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicUserService {

    private final UserRepository userRepository;

    public PublicUserResponse getUserByUsername(
            String username) {

        User user = findUser(username);

        return new PublicUserResponse(user);
    }

    private User findUser(
            String username) {

        return userRepository
                .findByUsername(username)
                .orElseGet(() -> findLegacyUser(username));
    }

    /*
     * 기존 사용자 중 username이 null인 계정은
     * user{id} 형식으로 접근할 수 있도록 한다.
     *
     * 예:
     * user5 -> id 5
     */
    private User findLegacyUser(
            String username) {

        if (username == null
                || !username.matches("user\\d+")) {

            throw new UserNotFoundException();
        }

        String idText = username.substring(4);

        Long userId;

        try {

            userId = Long.parseLong(idText);

        } catch (NumberFormatException exception) {

            throw new UserNotFoundException();
        }

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        UserNotFoundException::new);

        /*
         * 실제 username이 있는 사용자는
         * user{id} fallback으로 접근하지 않는다.
         */
        if (user.getUsername() != null
                && !user.getUsername().isBlank()) {

            throw new UserNotFoundException();
        }

        return user;
    }
}