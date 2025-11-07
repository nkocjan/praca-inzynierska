package com.bff.bff.dto.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UserCreateRequestDTO {
    private String name;
    private String surname;
    private String password;
    private String username;
    private String email;
    private String phoneNumber;
}
