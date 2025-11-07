package com.bff.bff.dto.ui;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestUiDTO {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
