package com.bff.bff.dto.api;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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
