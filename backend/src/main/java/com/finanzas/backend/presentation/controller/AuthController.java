package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.AuthRequest;
import com.finanzas.backend.application.dto.AuthResponse;
import com.finanzas.backend.application.dto.RegisterRequest;
import com.finanzas.backend.application.dto.MeResponse;
import com.finanzas.backend.application.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyAccount(@RequestParam String token) {
        authService.verifyAccount(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        MeResponse response = authService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }
}