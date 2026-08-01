package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.IncomeRequest;
import com.finanzas.backend.application.dto.IncomeResponse;
import com.finanzas.backend.application.service.IncomeService;
import com.finanzas.backend.application.util.CurrentUserUtil;
import com.finanzas.backend.application.util.CrudResponseConverter;
import com.finanzas.backend.domain.model.Income;
import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.infrastructure.repository.IncomeRepository;
import com.finanzas.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService, CrudResponseConverter<Income, IncomeResponse> {

    private final IncomeRepository incomeRepository;

    @Override
    @Transactional
    public IncomeResponse create(IncomeRequest request) {
        User user = CurrentUserUtil.getCurrentUser();

        Income income = Income.builder()
                .user(user)
                .description(request.description())
                .amount(request.amount())
                .date(request.date())
                .category(request.category())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public IncomeResponse findById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", id));
        CurrentUserUtil.validateOwnership(income.getUser(), user);
        return toResponse(income);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncomeResponse> findAll() {
        User user = CurrentUserUtil.getCurrentUser();
        return incomeRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public IncomeResponse update(Long id, IncomeRequest request) {
        User user = CurrentUserUtil.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", id));

        CurrentUserUtil.validateOwnership(income.getUser(), user);

        income.setDescription(request.description());
        income.setAmount(request.amount());
        income.setDate(request.date());
        income.setCategory(request.category());

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income", id));

        CurrentUserUtil.validateOwnership(income.getUser(), user);

        incomeRepository.deleteById(id);
    }

    @Override
    public IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getDescription(),
                income.getAmount(),
                income.getDate(),
                income.getCategory(),
                income.getCreatedAt(),
                income.getUpdatedAt()
        );
    }

}