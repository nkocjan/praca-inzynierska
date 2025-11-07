package com.bff.bff.dto.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class UserUpdateRequestDTO {
    private String name;
    private String surname;
    private String username;
    private String email;
    private String phoneNumber;
}
