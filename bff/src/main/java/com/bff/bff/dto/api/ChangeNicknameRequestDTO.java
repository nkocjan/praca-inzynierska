package com.bff.bff.dto.api;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeNicknameRequestDTO {
    private String newNickname;
}
