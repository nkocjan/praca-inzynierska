package com.bff.bff.dto.api;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BudgetCreateRequestDTO {
    private String name;
    private String description;
    private Boolean isActive;
    private UUID categoryId;
}
