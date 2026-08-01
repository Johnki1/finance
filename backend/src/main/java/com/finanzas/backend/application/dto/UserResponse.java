package com.finanzas.backend.application.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String[] roles,
        boolean emailVerified,
        Instant createdAt
) {
}