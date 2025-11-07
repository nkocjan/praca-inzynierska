package com.bff.bff.dto.ui;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseSearchRequestUiDTO {
    private String name;
    private BigDecimal amountFrom;
    private BigDecimal amountTo;
    private String description;
    private Boolean isPlanned;
    private LocalDateTime dateFrom;
    private LocalDateTime dateTo;
    private List<UUID> categoryIds;
}
