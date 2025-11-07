package com.bff.bff.dto.api;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SetDefaultBudgetsRequestDTO {
    private UUID categoryId;
    private BigDecimal weeklyAmount;
    private BigDecimal monthlyAmount;
    private BigDecimal yearlyAmount;
}
