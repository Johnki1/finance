package com.finanzas.backend.application.util;

import com.finanzas.backend.domain.model.FixedExpense;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class FixedExpenseDateFilter {

    private FixedExpenseDateFilter() {
    }

    public static List<FixedExpense> filterByCreatedOnOrBefore(List<FixedExpense> fixedExpenses, LocalDate endDate) {
        return fixedExpenses.stream()
                .filter(fe -> {
                    LocalDate created = fe.getCreatedAt().toLocalDate();
                    return !created.isAfter(endDate);
                })
                .collect(Collectors.toList());
    }
}