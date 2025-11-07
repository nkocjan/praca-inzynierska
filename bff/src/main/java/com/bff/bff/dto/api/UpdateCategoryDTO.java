package com.bff.bff.dto.api;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class UpdateCategoryDTO {
    private String name;
    private BigDecimal weekBudget;
    private BigDecimal monthBudget;
    private BigDecimal yearBudget;
}
