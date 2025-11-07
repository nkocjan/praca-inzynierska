package com.bff.bff.dto.ui;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class CreateExpenseRequestUiDTO {
    private String name;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
    private UUID categoryId;
    private Boolean isPlanned;
}
