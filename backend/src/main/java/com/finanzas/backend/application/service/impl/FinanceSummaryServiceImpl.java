package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.FinanceSummaryResponse;
import com.finanzas.backend.application.service.FinanceSummaryService;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceSummaryServiceImpl implements FinanceSummaryService {

    private final IncomeRepository incomeRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final VariableExpenseRepository variableExpenseRepository;

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getAccumulatedBalanceUpTo(LocalDate endDate) {
        User user = CurrentUserUtil.getCurrentUser();
        YearMonth endYM = YearMonth.from(endDate);

        BigDecimal accumulated = BigDecimal.ZERO;
        for (int y = 2020; y <= endYM.getYear(); y++) {
            int maxMonth = (y == endYM.getYear()) ? endYM.getMonthValue() : 12;
            for (int m = 1; m <= maxMonth; m++) {
                YearMonth ym = YearMonth.of(y, m);
                LocalDate s = ym.atDay(1);
                LocalDate monthEnd = ym.atEndOfMonth();
                LocalDate e = monthEnd.isAfter(endDate) ? endDate : monthEnd;
                LocalDate filterEnd = e;

                List<Income> incomes = incomeRepository.findByUserAndDateBetween(user, s, e);
                BigDecimal ti = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

                List<VariableExpense> variableExpenses = variableExpenseRepository.findByUserAndDateBetween(user, s, e);
                BigDecimal tv = variableExpenses.stream().map(VariableExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

                List<FixedExpense> fixedExpenses = FixedExpenseDateFilter.filterByCreatedOnOrBefore(fixedExpenseRepository.findByUser(user), filterEnd);
                BigDecimal tf = fixedExpenses.stream().map(FixedExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

                accumulated = accumulated.add(ti).subtract(tf).subtract(tv);
            }
        }
        return accumulated;
    }

    @Override
    @Transactional(readOnly = true)
    public FinanceSummaryResponse getMonthlySummary(int year, int month) {
        User user = CurrentUserUtil.getCurrentUser();

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Income> incomes = incomeRepository
                .findByUserAndDateBetween(user, startDate, endDate);
        List<VariableExpense> variableExpenses = variableExpenseRepository
                .findByUserAndDateBetween(user, startDate, endDate);
        List<FixedExpense> fixedExpenses = FixedExpenseDateFilter.filterByCreatedOnOrBefore(fixedExpenseRepository.findByUser(user), endDate);

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalFixedExpenses = fixedExpenses.stream()
                .map(FixedExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalVariableExpenses = variableExpenses.stream()
                .map(VariableExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = totalFixedExpenses.add(totalVariableExpenses);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        // Calcular el balance acumulado desde enero hasta el mes/año seleccionado
        BigDecimal accumulatedBalance = BigDecimal.ZERO;
        for (int y = 2020; y <= year; y++) {
            int maxMonth = (y == year) ? month : 12;
            for (int m = 1; m <= maxMonth; m++) {
                if (y == year && m == month) {
                    accumulatedBalance = accumulatedBalance.add(balance);
                } else {
                    YearMonth ym = YearMonth.of(y, m);
                    LocalDate s = ym.atDay(1);
                    LocalDate e = ym.atEndOfMonth();
                    List<Income> inc = incomeRepository.findByUserAndDateBetween(user, s, e);
                    BigDecimal ti = inc.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    List<VariableExpense> vare = variableExpenseRepository.findByUserAndDateBetween(user, s, e);
                    BigDecimal tv = vare.stream().map(VariableExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    List<FixedExpense> fe = FixedExpenseDateFilter.filterByCreatedOnOrBefore(fixedExpenseRepository.findByUser(user), e);
                    BigDecimal tf = fe.stream().map(FixedExpense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    accumulatedBalance = accumulatedBalance.add(ti).subtract(tf).subtract(tv);
                }
            }
        }

        return new FinanceSummaryResponse(totalIncome, totalFixedExpenses, totalVariableExpenses, balance, accumulatedBalance);
    }

}