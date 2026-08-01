package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.FinanceSummaryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface FinanceSummaryService {

    FinanceSummaryResponse getMonthlySummary(int year, int month);

    BigDecimal getAccumulatedBalanceUpTo(LocalDate endDate);
}
