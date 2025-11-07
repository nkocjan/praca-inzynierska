package com.bff.bff.dto.ui;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UserCreateRequestUiDTO {
    private String name;
    private String surname;
    private String password;
    private String username;
    private String email;
    private String phoneNumber;
}
