package com.finanzas.backend.application.dto;

public record MeResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String[] roles,
        boolean emailVerified,
        String createdAt
) {
}