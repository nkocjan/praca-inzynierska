package com.bff.bff.dto.api;

import lombok.Data;

@Data
public class ChangeEmailUiRequestDTO {
    private String newEmail;
    private String confirmNewEmail;
    private String password;
}
