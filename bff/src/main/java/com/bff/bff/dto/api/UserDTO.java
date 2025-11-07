package com.bff.bff.dto.api;

import java.util.UUID;
import lombok.Data;

@Data
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
