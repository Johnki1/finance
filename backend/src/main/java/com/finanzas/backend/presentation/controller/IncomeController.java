package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.IncomeRequest;
import com.finanzas.backend.application.dto.IncomeResponse;
import com.finanzas.backend.application.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeResponse> create(@Valid @RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> findById(@PathVariable Long id) {
        IncomeResponse response = incomeService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> findAll() {
        List<IncomeResponse> responses = incomeService.findAll();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        incomeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}