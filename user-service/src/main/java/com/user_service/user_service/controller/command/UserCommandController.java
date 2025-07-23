package com.user_service.user_service.controller.command;

import com.user_service.user_service.dto.*;
import com.user_service.user_service.service.UserCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserCommandController {
    private final UserCommandService service;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserCreateRequestDTO request) {
        return ResponseEntity
                .status(201)
                .body(service.createUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable UUID id,
            @RequestBody UserUpdateRequestDTO request) {
        return ResponseEntity
                .ok(service.updateUser(id, request));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<UserDTO> activateAccount(
            @PathVariable UUID id,
            @RequestBody ActivateAccountRequestDTO request) {
        return ResponseEntity
                .ok(service.activateAccount(id, request));
    }

    @PutMapping("/{id}/premium")
    public ResponseEntity<UserDTO> setPremium(
            @PathVariable UUID id,
            @RequestBody SetPremiumRequestDTO request) {
        return ResponseEntity
                .ok(service.setPremium(id, request));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable UUID id,
            @RequestBody ChangePasswordRequestDTO request) {
        service.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
