package com.expense_service.expense_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UpdateExpenseRequestDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
}
