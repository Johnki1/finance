package com.finanzas.backend.infrastructure.repository;

import com.finanzas.backend.domain.model.Income;
import com.finanzas.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    List<Income> findByUser(User user);
}
