package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.FinanceSummaryResponse;
import com.finanzas.backend.application.service.FinanceSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FinanceSummaryController {

    private final FinanceSummaryService financeSummaryService;

    @GetMapping("/summary")
    public ResponseEntity<FinanceSummaryResponse> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {

        FinanceSummaryResponse response = financeSummaryService.getMonthlySummary(year, month);
        return ResponseEntity.ok(response);
    }
}
