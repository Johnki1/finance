package com.finanzas.backend.infrastructure.repository;

import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.domain.model.VariableExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VariableExpenseRepository extends JpaRepository<VariableExpense, Long> {

    List<VariableExpense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    List<VariableExpense> findByUser(User user);
}
