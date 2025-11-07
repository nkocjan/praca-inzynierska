package com.user_service.user_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String phoneNumber;
    private Boolean isActive;
    private Boolean isPremium;
}
