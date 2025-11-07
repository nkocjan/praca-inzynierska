package com.bff.bff.dto.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class GetTotalExpensesAmountRequestDTO {
    List<UUID> categoryIds;
    LocalDateTime dateFrom;
    LocalDateTime dateTo;
}
