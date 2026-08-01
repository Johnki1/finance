package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.VariableExpenseRequest;
import com.finanzas.backend.application.dto.VariableExpenseResponse;
import com.finanzas.backend.application.service.VariableExpenseService;
import com.finanzas.backend.application.util.CurrentUserUtil;
import com.finanzas.backend.application.util.CrudResponseConverter;
import com.finanzas.backend.domain.model.VariableExpense;
import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.infrastructure.repository.VariableExpenseRepository;
import com.finanzas.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VariableExpenseServiceImpl implements VariableExpenseService, CrudResponseConverter<VariableExpense, VariableExpenseResponse> {

    private final VariableExpenseRepository variableExpenseRepository;

    @Override
    @Transactional
    public VariableExpenseResponse create(VariableExpenseRequest request) {
        User user = CurrentUserUtil.getCurrentUser();

        VariableExpense expense = VariableExpense.builder()
                .user(user)
                .description(request.description())
                .amount(request.amount())
                .date(request.date())
                .category(request.category())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        VariableExpense saved = variableExpenseRepository.save(expense);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VariableExpenseResponse findById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        VariableExpense expense = variableExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VariableExpense", id));
        CurrentUserUtil.validateOwnership(expense.getUser(), user);
        return toResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VariableExpenseResponse> findAll() {
        User user = CurrentUserUtil.getCurrentUser();
        return variableExpenseRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public VariableExpenseResponse update(Long id, VariableExpenseRequest request) {
        User user = CurrentUserUtil.getCurrentUser();
        VariableExpense expense = variableExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VariableExpense", id));

        CurrentUserUtil.validateOwnership(expense.getUser(), user);

        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setDate(request.date());
        expense.setCategory(request.category());

        VariableExpense saved = variableExpenseRepository.save(expense);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User user = CurrentUserUtil.getCurrentUser();
        VariableExpense expense = variableExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VariableExpense", id));

        CurrentUserUtil.validateOwnership(expense.getUser(), user);

        variableExpenseRepository.deleteById(id);
    }

    @Override
    public VariableExpenseResponse toResponse(VariableExpense expense) {
        return new VariableExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getDate(),
                expense.getCategory(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}