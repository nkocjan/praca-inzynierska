package com.bff.bff.dto.api;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UpdateExpenseRequestDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
}
