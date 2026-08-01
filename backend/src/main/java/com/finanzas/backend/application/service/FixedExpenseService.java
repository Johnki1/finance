package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.FixedExpenseRequest;
import com.finanzas.backend.application.dto.FixedExpenseResponse;

import java.util.List;

public interface FixedExpenseService {

    FixedExpenseResponse create(FixedExpenseRequest request);

    FixedExpenseResponse findById(Long id);

    List<FixedExpenseResponse> findAll();

    FixedExpenseResponse update(Long id, FixedExpenseRequest request);

    void deleteById(Long id);
}