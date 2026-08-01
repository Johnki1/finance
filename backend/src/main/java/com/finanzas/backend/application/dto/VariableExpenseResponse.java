package com.finanzas.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record VariableExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        LocalDate date,
        String category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}