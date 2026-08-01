package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.AuthRequest;
import com.finanzas.backend.application.dto.AuthResponse;
import com.finanzas.backend.application.dto.RegisterRequest;
import com.finanzas.backend.application.dto.MeResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);

    void verifyAccount(String token);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);

    MeResponse getCurrentUser(String email);
}