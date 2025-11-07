package com.expense_service.expense_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ExpenseDTO {
    private UUID id;
    private String name;
    private BigDecimal amount;
    private String description;
    private Boolean isPlanned;
    private LocalDateTime date;
    private CategoryRepDTO category;
}
