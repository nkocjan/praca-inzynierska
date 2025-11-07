package com.bff.bff.dto.api;

import com.bff.bff.dto.BudgetType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;

@Data
public class BudgetDTO {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
    private BudgetType period;
    private BigDecimal amount;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private CategorySimplifiedDTO category;
}
