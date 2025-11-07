package com.bff.bff.dto.api;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestDTO {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
