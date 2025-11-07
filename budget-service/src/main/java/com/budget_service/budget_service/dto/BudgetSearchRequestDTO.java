package com.budget_service.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class BudgetSearchRequestDTO {
    private String name;
    private List<UUID> categoryIds;
    private LocalDateTime periodDateFrom;
    private LocalDateTime periodDateTo;
    private BigDecimal amountFrom;
    private BigDecimal amountTo;
    private String periodType;
    private Boolean isArchived;
}
