package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.UserServiceClient;
import com.bff.bff.dto.api.*;
import com.bff.bff.dto.ui.UserUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/users")
@RequiredArgsConstructor
public class UserCommandController {

    private final UserServiceClient userServiceClient;
    private final BudgetServiceClient budgetServiceClient;
    private final MapperExtension mapperExtension;

    @PostMapping
    public ResponseEntity<UserUiDTO> createUser(@RequestBody UserCreateRequestDTO request) {
        var userDTO = userServiceClient.createUser(request);
        budgetServiceClient.initUserCategories(userDTO.getId());
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserUiDTO> updateUser(
            @PathVariable UUID id, @RequestBody UserUpdateRequestDTO request) {
        var userDTO = userServiceClient.updateUser(id, request);
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<UserUiDTO> activateAccount(
            @PathVariable UUID id, @RequestBody ActivateAccountRequestDTO request) {
        var userDTO = userServiceClient.activateAccount(id, request);
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    @PutMapping("/{id}/premium")
    public ResponseEntity<UserUiDTO> setPremium(
            @PathVariable UUID id, @RequestBody SetPremiumRequestDTO request) {
        var userDTO = userServiceClient.setPremium(id, request);
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable UUID id, @RequestBody ChangePasswordRequestDTO request) {
        userServiceClient.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userServiceClient.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
