package com.expense_service.expense_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRepDTO {
    private UUID id;
    private Boolean isActive;
    private Boolean isPremium;
    private String eventType;
}
