package com.user_service.user_service.dto;

import lombok.*;

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