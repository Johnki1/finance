package com.finanzas.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record QuarterlyReportResponse(
        int year,
        int quarter,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal totalFixedExpenses,
        BigDecimal totalVariableExpenses,
        BigDecimal balance,
        BigDecimal accumulatedBalance
) {
}
