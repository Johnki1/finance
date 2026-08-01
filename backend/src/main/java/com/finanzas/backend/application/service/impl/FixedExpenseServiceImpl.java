package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.FixedExpenseRequest;
import com.finanzas.backend.application.dto.FixedExpenseResponse;
import com.finanzas.backend.application.service.FixedExpenseService;
import com.finanzas.backend.application.util.CurrentUserUtil;
import com.finanzas.backend.application.util.CrudResponseConverter;
import com.finanzas.backend.domain.model.FixedExpense;
import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.infrastructure.repository.FixedExpenseRepository;
import com.finanzas.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixedExpenseServiceImpl implements FixedExpenseService, CrudResponseConverter<FixedExpense, FixedExpenseResponse> {

    private final FixedExpenseRepository fixedExpenseRepository;

    @Override
    @Transactional
    public FixedExpenseResponse create(FixedExpenseRequest request) {
        User user = CurrentUserUtil.getCurrentUser();

        FixedExpense expense = FixedExpense.builder()
                .user(user)
                .description(request.description())
                .amount(request.amount())
                .category(request.category())
                .dueDay(request.dueDay())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        FixedExpense saved = fixedExpenseRepository.save(expense);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FixedExpenseResponse findById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        FixedExpense expense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FixedExpense", id));
        CurrentUserUtil.validateOwnership(expense.getUser(), user);
        return toResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FixedExpenseResponse> findAll() {
        User user = CurrentUserUtil.getCurrentUser();
        return fixedExpenseRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public FixedExpenseResponse update(Long id, FixedExpenseRequest request) {
        User user = CurrentUserUtil.getCurrentUser();
        FixedExpense expense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FixedExpense", id));

        CurrentUserUtil.validateOwnership(expense.getUser(), user);

        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setDueDay(request.dueDay());

        FixedExpense saved = fixedExpenseRepository.save(expense);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        FixedExpense expense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FixedExpense", id));

        CurrentUserUtil.validateOwnership(expense.getUser(), user);

        fixedExpenseRepository.deleteById(id);
    }

    @Override
    public FixedExpenseResponse toResponse(FixedExpense expense) {
        return new FixedExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDueDay(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }

}