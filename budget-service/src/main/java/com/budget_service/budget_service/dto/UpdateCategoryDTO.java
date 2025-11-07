package com.budget_service.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateCategoryDTO {
    private String name;
    private BigDecimal weekBudget;
    private BigDecimal monthBudget;
    private BigDecimal yearBudget;
}
