package com.finanzas.backend.infrastructure.repository;

import com.finanzas.backend.domain.model.FixedExpense;
import com.finanzas.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {

    List<FixedExpense> findByUser(User user);
}
