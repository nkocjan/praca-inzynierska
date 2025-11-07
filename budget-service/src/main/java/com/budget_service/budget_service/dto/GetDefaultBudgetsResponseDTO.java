package com.budget_service.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GetDefaultBudgetsResponseDTO {
    private BigDecimal weeklyAmount;
    private BigDecimal monthlyAmount;
    private BigDecimal yearlyAmount;
}
