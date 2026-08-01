package com.finanzas.backend.application.dto;

import java.time.Instant;

public record AuthResponse(
        String token,
        String tokenType,
        Instant expiresAt,
        String refreshToken,
        UserInfo user
) {
    public record UserInfo(
            Long id,
            String email,
            String firstName,
            String lastName,
            String[] roles,
            boolean emailVerified
    ) {}
}