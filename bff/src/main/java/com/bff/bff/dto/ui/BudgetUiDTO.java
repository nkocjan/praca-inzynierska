package com.bff.bff.dto.ui;

import com.bff.bff.dto.BudgetType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;

@Data
public class BudgetUiDTO {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
    private BudgetType period;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private CategorySimplifiedUiDTO category;
}
