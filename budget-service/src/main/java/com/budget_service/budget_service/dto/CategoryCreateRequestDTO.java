package com.budget_service.budget_service.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class CategoryCreateRequestDTO {
    private String name;
    private String description;
    private Boolean isActive;
    private UUID userId;
}
