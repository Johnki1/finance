package com.finanzas.backend.presentation.controller;

import com.finanzas.backend.application.dto.QuarterlyReportResponse;
import com.finanzas.backend.application.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/quarterly")
    public ResponseEntity<List<QuarterlyReportResponse>> getQuarterlyReport(
            @RequestParam int year,
            @RequestParam int quarter) {

        List<QuarterlyReportResponse> response = reportService.getQuarterlyReport(year, quarter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/custom")
    public ResponseEntity<List<QuarterlyReportResponse>> getCustomReport(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        List<QuarterlyReportResponse> response = reportService.getCustomReport(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
