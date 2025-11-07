package com.bff.bff.dto.api;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class BarChartDataDTO {
    private List<String> labels;
    private List<BigDecimal> expensesData;
    private List<BigDecimal> budgetData;
}