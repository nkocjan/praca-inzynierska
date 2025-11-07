package com.budget_service.budget_service.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
public class CategoryCreateRequestDTO {
    private String name;
    private BigDecimal weekBudget;
    private BigDecimal monthBudget;
    private BigDecimal yearBudget;
}
