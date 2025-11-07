package com.budget_service.budget_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CategorySimplifiedDTO {
    private UUID id;
    private String name;
}
