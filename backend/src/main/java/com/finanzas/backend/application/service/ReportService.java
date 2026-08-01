package com.finanzas.backend.application.service;

import com.finanzas.backend.application.dto.QuarterlyReportResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    List<QuarterlyReportResponse> getQuarterlyReport(int year, int quarter);

    List<QuarterlyReportResponse> getCustomReport(LocalDate startDate, LocalDate endDate);
}
