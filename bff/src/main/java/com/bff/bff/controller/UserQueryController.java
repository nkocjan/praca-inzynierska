package com.bff.bff.controller;

import com.bff.bff.client.UserServiceClient;
import com.bff.bff.dto.ui.UserUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/users")
@RequiredArgsConstructor
public class UserQueryController {

    private final MapperExtension mapperExtensions;
    private final UserServiceClient userServiceClient;

    @GetMapping("/{id}")
    public UserUiDTO getUser(@PathVariable UUID id) {
        return mapperExtensions.toUserUiDTO(userServiceClient.getUserById(id));
    }
}
