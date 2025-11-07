package com.bff.bff.dto.ui;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GetDefaultBudgetsResponseUiDTO {
    private BigDecimal weeklyAmount;
    private BigDecimal monthlyAmount;
    private BigDecimal yearlyAmount;
}
