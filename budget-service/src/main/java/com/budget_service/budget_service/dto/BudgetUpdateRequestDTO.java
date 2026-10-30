package com.budget_service.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetUpdateRequestDTO {
    private BigDecimal amount;
}
