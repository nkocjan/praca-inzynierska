package com.bff.bff.dto.ui;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BudgetCreateRequestUiDTO {
    private String name;
    private String description;
    private Boolean isActive;
    private UUID categoryId;
}
