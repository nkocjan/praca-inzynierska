package com.expense_service.expense_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class GetTotalExpensesAmountRequestDTO {
    List<UUID> categoryIds;
    LocalDateTime dateFrom;
    LocalDateTime dateTo;
}

