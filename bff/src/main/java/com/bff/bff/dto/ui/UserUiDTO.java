package com.bff.bff.dto.ui;

import java.util.UUID;
import lombok.Data;

@Data
public class UserUiDTO {
    private UUID id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String phoneNumber;
    private Boolean isActive;
    private Boolean isPremium;
}
