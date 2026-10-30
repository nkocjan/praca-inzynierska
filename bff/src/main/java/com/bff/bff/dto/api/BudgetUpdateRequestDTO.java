package com.bff.bff.dto.api;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class BudgetUpdateRequestDTO {
    private BigDecimal amount;
}
