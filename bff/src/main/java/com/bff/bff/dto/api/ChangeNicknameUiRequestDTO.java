package com.bff.bff.dto.api;

import lombok.Data;

@Data
public class ChangeNicknameUiRequestDTO {
    private String newNickname;
    private String password;
    private String confirmPassword;
}
