package com.budget_service.budget_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CategoryDTO {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;

    private BudgetDTO weeklyBudget;
    private BudgetDTO monthlyBudget;
    private BudgetDTO yearlyBudget;
}
