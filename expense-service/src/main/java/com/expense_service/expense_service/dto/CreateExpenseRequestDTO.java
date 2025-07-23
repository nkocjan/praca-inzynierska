package com.expense_service.expense_service.dto;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class CreateExpenseRequestDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private UUID categoryId;
    private UUID userId;
}
