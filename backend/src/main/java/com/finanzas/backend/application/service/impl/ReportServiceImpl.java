package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.QuarterlyReportResponse;
import com.finanzas.backend.application.service.FinanceSummaryService;
import com.finanzas.backend.application.service.ReportService;
import com.finanzas.backend.application.util.CurrentUserUtil;
import com.finanzas.backend.application.util.FixedExpenseDateFilter;
import com.finanzas.backend.domain.model.FixedExpense;
import com.finanzas.backend.domain.model.Income;
import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.domain.model.VariableExpense;
import com.finanzas.backend.infrastructure.repository.FixedExpenseRepository;
import com.finanzas.backend.infrastructure.repository.IncomeRepository;
import com.finanzas.backend.infrastructure.repository.VariableExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final IncomeRepository incomeRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final VariableExpenseRepository variableExpenseRepository;
    private final FinanceSummaryService financeSummaryService;

    @Override
    public List<QuarterlyReportResponse> getQuarterlyReport(int year, int quarter) {
        User user = CurrentUserUtil.getCurrentUser();

        // Validación: el trimestre debe estar completamente finalizado
        LocalDate today = LocalDate.now();
        int endMonth = quarter * 3;
        YearMonth quarterEndYM = YearMonth.of(year, endMonth);
        if (!quarterEndYM.atEndOfMonth().isBefore(YearMonth.from(today).atEndOfMonth())) {
            throw new IllegalArgumentException("No se puede generar el reporte porque el trimestre incluye el mes en curso o meses futuros.");
        }

        int startMonth = (quarter - 1) * 3 + 1;

        LocalDate quarterStart = YearMonth.of(year, startMonth).atDay(1);
        LocalDate quarterEnd = YearMonth.of(year, endMonth).atEndOfMonth();

        List<QuarterlyReportResponse> reports = new java.util.ArrayList<>();

        for (int m = startMonth; m <= endMonth; m++) {
            YearMonth ym = YearMonth.of(year, m);
            LocalDate s = ym.atDay(1);
            LocalDate e = ym.atEndOfMonth();

            List<Income> incomes = incomeRepository.findByUserAndDateBetween(user, s, e);
            BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            List<VariableExpense> varExpenses = variableExpenseRepository.findByUserAndDateBetween(user, s, e);
            BigDecimal totalVariable = varExpenses.stream().map(VariableExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            LocalDate filterEnd = e;
            List<FixedExpense> fixedExpenses = FixedExpenseDateFilter.filterByCreatedOnOrBefore(fixedExpenseRepository.findByUser(user), filterEnd);
            BigDecimal totalFixed = fixedExpenses.stream().map(FixedExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal balance = totalIncome.subtract(totalFixed).subtract(totalVariable);

            BigDecimal accumulatedBalance = financeSummaryService.getAccumulatedBalanceUpTo(e);
            reports.add(new QuarterlyReportResponse(
                    year,
                    quarter,
                    s,
                    e,
                    totalIncome,
                    totalFixed,
                    totalVariable,
                    balance,
                    accumulatedBalance
            ));
        }

        return reports;
    }

    @Override
    public List<QuarterlyReportResponse> getCustomReport(LocalDate startDate, LocalDate endDate) {
        User user = CurrentUserUtil.getCurrentUser();

        // Validar que endDate no supere la fecha actual
        LocalDate today = LocalDate.now();
        if (endDate.isAfter(today)) {
            throw new IllegalArgumentException("La fecha fin no puede superar la fecha actual");
        }

        // Validación: el periodo debe estar completamente finalizado
        YearMonth endYM = YearMonth.from(endDate);
        if (!endYM.atEndOfMonth().isBefore(YearMonth.from(today).atEndOfMonth())) {
            throw new IllegalArgumentException("No se puede generar el reporte porque el mes final no ha terminado.");
        }

        // Validar que el rango no sea mayor a 4 meses
        int monthsBetween = (endDate.getYear() - startDate.getYear()) * 12 + (endDate.getMonthValue() - startDate.getMonthValue());
        if (monthsBetween > 4) {
            throw new IllegalArgumentException("El rango de fecha no puede ser superior a 4 meses");
        }

        List<QuarterlyReportResponse> reports = new java.util.ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            YearMonth ym = YearMonth.from(current);
            LocalDate s = ym.atDay(1);
            LocalDate monthEnd = ym.atEndOfMonth();
            LocalDate e = monthEnd.isAfter(endDate) ? endDate : monthEnd;

            List<Income> incomes = incomeRepository.findByUserAndDateBetween(user, s, e);
            BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            List<VariableExpense> varExpenses = variableExpenseRepository.findByUserAndDateBetween(user, s, e);
            BigDecimal totalVariable = varExpenses.stream().map(VariableExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            List<FixedExpense> fixedExpenses = FixedExpenseDateFilter.filterByCreatedOnOrBefore(fixedExpenseRepository.findByUser(user), e);
            BigDecimal totalFixed = fixedExpenses.stream().map(FixedExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal balance = totalIncome.subtract(totalFixed).subtract(totalVariable);

            BigDecimal accumulatedBalance = financeSummaryService.getAccumulatedBalanceUpTo(e);
            reports.add(new QuarterlyReportResponse(
                    ym.getYear(),
                    ym.getMonthValue(),
                    s,
                    e,
                    totalIncome,
                    totalFixed,
                    totalVariable,
                    balance,
                    accumulatedBalance
            ));

            current = ym.plusMonths(1).atDay(1);
        }

        return reports;
    }
}
