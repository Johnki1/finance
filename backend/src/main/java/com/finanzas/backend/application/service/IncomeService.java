package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.IncomeRequest;
import com.finanzas.backend.application.dto.IncomeResponse;

import java.util.List;

public interface IncomeService {

    IncomeResponse create(IncomeRequest request);

    IncomeResponse findById(Long id);

    List<IncomeResponse> findAll();

    IncomeResponse update(Long id, IncomeRequest request);

    void deleteById(Long id);
}