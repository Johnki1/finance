package com.finanzas.backend.application.dto;

import com.finanzas.backend.domain.enums.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record FixedExpenseRequest(
        @NotBlank(message = "La descripción es obligatoria")
        String description,

        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser positivo")
        BigDecimal amount,

        @NotNull(message = "La categoría es obligatoria")
        ExpenseCategory category,

        Integer dueDay
) {
}