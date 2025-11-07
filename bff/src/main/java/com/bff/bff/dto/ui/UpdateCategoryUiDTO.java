package com.bff.bff.dto.ui;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class UpdateCategoryUiDTO {
    private String name;
    private BigDecimal weekBudget;
    private BigDecimal monthBudget;
    private BigDecimal yearBudget;
}
