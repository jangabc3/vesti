package com.vesti.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.config.JwtProvider;
import com.vesti.backend.dto.request.ChangePasswordRequest;
import com.vesti.backend.dto.request.UserLoginRequest;
import com.vesti.backend.dto.request.UserSignupRequest;
import com.vesti.backend.dto.response.LoginResponse;
import com.vesti.backend.dto.response.UserResponse;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.CurrentPasswordMismatchException;
import com.vesti.backend.exception.DuplicateEmailException;
import com.vesti.backend.exception.InvalidLoginException;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CurrentUserProvider currentUserProvider;

    // 회원가입
    @Transactional
    public UserResponse signup(UserSignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException();
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }

    // 로그인
    @Transactional(readOnly = true)
    public LoginResponse login(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidLoginException::new);

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidLoginException();
        }

        String token = jwtProvider.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                token);
    }

    // 현재 로그인한 사용자 조회
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {

        User user = currentUserProvider.getCurrentUser();

        return new UserResponse(user);
    }

    // 비밀번호 변경
    @Transactional
    public void changePassword(ChangePasswordRequest request) {

        User user = currentUserProvider.getCurrentUser();

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new CurrentPasswordMismatchException();
        }

        user.changePassword(
                passwordEncoder.encode(request.getNewPassword()));
    }
}