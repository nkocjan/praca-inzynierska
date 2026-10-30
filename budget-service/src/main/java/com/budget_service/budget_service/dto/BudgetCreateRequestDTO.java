package com.budget_service.budget_service.dto;

import com.budget_service.budget_service.enums.BudgetType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BudgetCreateRequestDTO {
    private UUID categoryId;
    private BudgetType period;
    private BigDecimal amount;
    // Any day of the week, month or year the budget is for; today when missing.
    private LocalDate date;
}
