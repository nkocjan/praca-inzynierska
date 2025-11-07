package com.budget_service.budget_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class BudgetCreateRequestDTO {
    private String name;
    private String description;
    private Boolean isActive;
    private UUID categoryId;
}
