package com.bff.bff.dto.api;

import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetCategoriesRequestDTO {
    private List<UUID> categoryIds;
}
