package com.bff.bff.dto.api;

import com.bff.bff.dto.BudgetType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BudgetCreateRequestDTO {
    private UUID categoryId;
    private BudgetType period;
    private BigDecimal amount;
    private LocalDate date;
}
