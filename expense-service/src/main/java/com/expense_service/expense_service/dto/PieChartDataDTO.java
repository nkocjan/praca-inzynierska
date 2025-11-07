package com.expense_service.expense_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PieChartDataDTO {
    private List<String> labels;
    private List<BigDecimal> data;
}
