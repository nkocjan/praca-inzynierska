package com.budget_service.budget_service.dto;

import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetCategoriesRequestDTO {
    private List<UUID> categoryIds;
}
