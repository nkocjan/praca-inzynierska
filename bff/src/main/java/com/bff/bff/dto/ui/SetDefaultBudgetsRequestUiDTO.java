package com.bff.bff.dto.ui;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SetDefaultBudgetsRequestUiDTO {
    private UUID categoryId;
    private BigDecimal weeklyAmount;
    private BigDecimal monthlyAmount;
    private BigDecimal yearlyAmount;
}
