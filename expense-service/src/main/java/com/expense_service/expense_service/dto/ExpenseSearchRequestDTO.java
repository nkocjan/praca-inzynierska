package com.expense_service.expense_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ExpenseSearchRequestDTO {
    private String name;
    private BigDecimal amountFrom;
    private BigDecimal amountTo;
    private String description;
    private Boolean isPlanned;
    private LocalDateTime dateFrom;
    private LocalDateTime dateTo;
    private UUID userId;
    private List<UUID> categoryIds;
}
