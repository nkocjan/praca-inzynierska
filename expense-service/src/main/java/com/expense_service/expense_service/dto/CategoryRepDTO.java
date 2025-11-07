package com.expense_service.expense_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryRepDTO {
    private UUID id;
    private String name;
    private Boolean isActive;
}
