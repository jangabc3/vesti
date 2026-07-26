package com.vesti.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;

import com.vesti.backend.dto.request.ChangePasswordRequest;
import com.vesti.backend.dto.request.UserLoginRequest;
import com.vesti.backend.dto.request.UserSignupRequest;
import com.vesti.backend.dto.response.LoginResponse;
import com.vesti.backend.dto.response.UserResponse;
import com.vesti.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public UserResponse signup(
            @Valid @RequestBody UserSignupRequest request) {

        return userService.signup(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody UserLoginRequest request) {

        return userService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        return userService.getCurrentUser();
    }

    @PatchMapping("/me/password")
    public void changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);
    }
}