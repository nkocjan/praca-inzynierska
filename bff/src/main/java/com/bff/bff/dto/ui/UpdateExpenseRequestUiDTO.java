package com.bff.bff.dto.ui;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UpdateExpenseRequestUiDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
}
