package com.expense_service.expense_service.dto;

import lombok.Data;

@Data
public class BarChartDataPairDTO {
    private String categoryId;
    private BarChartDataDTO data;
}
