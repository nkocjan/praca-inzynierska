package com.user_service.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class UserRepDTO {
    private UUID id;
    private Boolean isActive;
    private Boolean isPremium;
}