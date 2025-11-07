package com.bff.bff.dto.ui;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryUiDTO {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;

    private BudgetUiDTO weeklyBudget;
    private BudgetUiDTO monthlyBudget;
    private BudgetUiDTO yearlyBudget;
}
