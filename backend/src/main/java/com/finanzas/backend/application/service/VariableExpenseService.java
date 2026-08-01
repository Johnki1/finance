package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.VariableExpenseRequest;
import com.finanzas.backend.application.dto.VariableExpenseResponse;

import java.util.List;

public interface VariableExpenseService {

    VariableExpenseResponse create(VariableExpenseRequest request);

    VariableExpenseResponse findById(Long id);

    List<VariableExpenseResponse> findAll();

    VariableExpenseResponse update(Long id, VariableExpenseRequest request);

    void deleteById(Long id);
}