package com.finanzas.backend.application.dto;

import java.math.BigDecimal;

public record FinanceSummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalFixedExpenses,
        BigDecimal totalVariableExpenses,
        BigDecimal balance,
        BigDecimal accumulatedBalance
) {
}