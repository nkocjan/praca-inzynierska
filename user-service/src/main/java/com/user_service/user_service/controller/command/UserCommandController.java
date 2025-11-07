package com.user_service.user_service.controller.command;

import com.user_service.user_service.dto.*;
import com.user_service.user_service.service.UserCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserCommandController {
    private final UserCommandService service;

    @PostMapping
    public UserDTO createUser(@RequestBody UserCreateRequestDTO request) {
        System.out.println("Creating user with data: " + request);
        var createdUser = service.createUser(request);
        System.out.println("Created user: " + createdUser);
        return createdUser;
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(
            @PathVariable UUID id,
            @RequestBody UserUpdateRequestDTO request) {
        System.out.println("Updating user with ID: " + id + " with data: " + request);
        var updatedUser = service.updateUser(id, request);
        System.out.println("Updated user: " + updatedUser);
        return updatedUser;
    }

    @PutMapping("/{id}/activate")
    public UserDTO activateAccount(
            @PathVariable UUID id,
            @RequestBody ActivateAccountRequestDTO request) {
        System.out.println("Activating account for user with ID: " + id + " with data: " + request);
        var result = service.activateAccount(id, request);
        System.out.println("Activated account: " + result);
        return result;
    }

    @PutMapping("/{id}/premium")
    public UserDTO setPremium(
            @PathVariable UUID id,
            @RequestBody SetPremiumRequestDTO request) {
        System.out.println("Setting premium status for user with ID: " + id + " to: " + request.getIsPremium());
        var result = service.setPremium(id, request);
        System.out.println("Updated premium status: " + result);
        return result;
    }

    @PutMapping("/{id}/password")
    public void changePassword(
            @PathVariable UUID id,
            @RequestBody ChangePasswordRequestDTO request) {
        System.out.println("Changing password for user with ID: " + id);
        service.changePassword(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        System.out.println("Deleting user with ID: " + id);
        service.deleteUser(id);
    }
}
