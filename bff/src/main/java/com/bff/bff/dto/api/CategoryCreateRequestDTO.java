package com.bff.bff.dto.api;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryCreateRequestDTO {
    private String name;
    private BigDecimal weekBudget;
    private BigDecimal monthBudget;
    private BigDecimal yearBudget;
}
