package com.finanzas.backend.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeRequest(
        @NotBlank(message = "La descripción es obligatoria")
        String description,

        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser positivo")
        BigDecimal amount,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate date,

        String category
) {
}