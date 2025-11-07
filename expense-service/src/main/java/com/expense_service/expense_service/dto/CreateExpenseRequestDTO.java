package com.expense_service.expense_service.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class CreateExpenseRequestDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
    private UUID categoryId;
    private Boolean isPlanned;
}
