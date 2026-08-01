package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.FixedExpenseRequest;
import com.finanzas.backend.application.dto.FixedExpenseResponse;
import com.finanzas.backend.application.service.FixedExpenseService;
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
@RequestMapping("/api/v1/fixed-expenses")
@RequiredArgsConstructor
public class FixedExpenseController {

    private final FixedExpenseService fixedExpenseService;

    @PostMapping
    public ResponseEntity<FixedExpenseResponse> create(@Valid @RequestBody FixedExpenseRequest request) {
        FixedExpenseResponse response = fixedExpenseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> findById(@PathVariable Long id) {
        FixedExpenseResponse response = fixedExpenseService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FixedExpenseResponse>> findAll() {
        List<FixedExpenseResponse> responses = fixedExpenseService.findAll();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> update(@PathVariable Long id,
                                                        @Valid @RequestBody FixedExpenseRequest request) {
        FixedExpenseResponse response = fixedExpenseService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        fixedExpenseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}