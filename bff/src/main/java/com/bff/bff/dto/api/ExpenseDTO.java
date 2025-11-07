package com.bff.bff.dto.api;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;

@Data
public class ExpenseDTO {
    private UUID id;
    private String name;
    private BigDecimal amount;
    private String description;
    private Boolean isPlanned;
    private LocalDateTime date;
    private CategoryDTO category;
}
