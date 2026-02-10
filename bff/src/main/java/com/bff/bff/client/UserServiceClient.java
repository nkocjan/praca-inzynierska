package com.bff.bff.client;

import com.bff.bff.dto.api.*;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {
    @GetMapping("/api/v1/users/{uuid}")
    UserDTO getUserById(@PathVariable("uuid") UUID uuid);

    @PostMapping("/api/v1/users")
    UserDTO createUser(@RequestBody UserCreateRequestDTO request);

    @PutMapping("/api/v1/users/{id}")
    UserDTO updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequestDTO request);

    @PutMapping("/api/v1/users/{id}/activate")
    UserDTO activateAccount(@PathVariable UUID id, @RequestBody ActivateAccountRequestDTO request);

    @PutMapping("/api/v1/users/{id}/premium")
    UserDTO setPremium(@PathVariable UUID id, @RequestBody SetPremiumRequestDTO request);

    @PutMapping("/api/v1/users/{id}/password")
    void changePassword(@PathVariable UUID id, @RequestBody ChangePasswordRequestDTO request);

    @DeleteMapping("/api/v1/users/{id}")
    void deleteUser(@PathVariable UUID id);

    @PutMapping("/api/v1/users/{id}/nickname")
    UserDTO changeNickname(@PathVariable UUID id, @RequestBody ChangeNicknameRequestDTO request);

    @PutMapping("/api/v1/users/{id}/email")
    UserDTO changeEmail(@PathVariable UUID id, @RequestBody ChangeEmailRequestDTO request);
}
