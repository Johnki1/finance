package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.VariableExpenseRequest;
import com.finanzas.backend.application.dto.VariableExpenseResponse;
import com.finanzas.backend.application.service.VariableExpenseService;
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
@RequestMapping("/api/v1/variable-expenses")
@RequiredArgsConstructor
public class VariableExpenseController {

    private final VariableExpenseService variableExpenseService;

    @PostMapping
    public ResponseEntity<VariableExpenseResponse> create(@Valid @RequestBody VariableExpenseRequest request) {
        VariableExpenseResponse response = variableExpenseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VariableExpenseResponse> findById(@PathVariable Long id) {
        VariableExpenseResponse response = variableExpenseService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VariableExpenseResponse>> findAll() {
        List<VariableExpenseResponse> responses = variableExpenseService.findAll();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VariableExpenseResponse> update(@PathVariable Long id,
                                                           @Valid @RequestBody VariableExpenseRequest request) {
        VariableExpenseResponse response = variableExpenseService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        variableExpenseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}