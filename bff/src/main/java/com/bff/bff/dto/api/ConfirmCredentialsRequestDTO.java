package com.bff.bff.dto.api;

import lombok.Data;

@Data
public class ConfirmCredentialsRequestDTO {
    private String email;
    private String password;
}
