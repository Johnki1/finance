package com.finanzas.backend.application.dto;

import com.finanzas.backend.domain.enums.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FixedExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        ExpenseCategory category,
        Integer dueDay,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}