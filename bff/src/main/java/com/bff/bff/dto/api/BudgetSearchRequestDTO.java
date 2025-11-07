package com.bff.bff.dto.api;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;

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
