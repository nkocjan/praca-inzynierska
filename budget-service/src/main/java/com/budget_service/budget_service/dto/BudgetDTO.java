package com.budget_service.budget_service.dto;

import com.budget_service.budget_service.enums.BudgetType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class BudgetDTO {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
    private BudgetType period;
    private BigDecimal amount;
    private BigDecimal currentSpent;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private UUID categoryId;
    private UUID userId;
}
