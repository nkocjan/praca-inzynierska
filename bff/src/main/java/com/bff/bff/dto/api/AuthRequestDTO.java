package com.bff.bff.dto.api;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequestDTO {
    private String username;
    private String password;
}
