package com.user_service.user_service.controller.command;

import com.user_service.user_service.dto.*;
import com.user_service.user_service.service.UserCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserCommandController {
    private final UserCommandService service;

    private static void assertSameUser(UUID authenticatedUserId, UUID pathUserId) {
        if (authenticatedUserId == null || pathUserId == null || !authenticatedUserId.equals(pathUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserCreateRequestDTO request) {
        System.out.println("Creating user with data: " + request);
        var createdUser = service.createUser(request);
        System.out.println("Created user: " + createdUser);
        return createdUser;
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody UserUpdateRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Updating user with ID: " + id + " with data: " + request);
        var updatedUser = service.updateUser(id, request);
        System.out.println("Updated user: " + updatedUser);
        return updatedUser;
    }

    @PutMapping("/{id}/activate")
    public UserDTO activateAccount(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody ActivateAccountRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Activating account for user with ID: " + id + " with data: " + request);
        var result = service.activateAccount(id, request);
        System.out.println("Activated account: " + result);
        return result;
    }

    @PutMapping("/{id}/premium")
    public UserDTO setPremium(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody SetPremiumRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Setting premium status for user with ID: " + id + " to: " + request.getIsPremium());
        var result = service.setPremium(id, request);
        System.out.println("Updated premium status: " + result);
        return result;
    }

    @PutMapping("/{id}/password")
    public void changePassword(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody ChangePasswordRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Changing password for user with ID: " + id);
        service.changePassword(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@AuthenticationPrincipal UUID authenticatedUserId, @PathVariable UUID id) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Deleting user with ID: " + id);
        service.deleteUser(id);
    }

    @PutMapping("/{id}/nickname")
    public UserDTO changeNickname(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody ChangeNicknameRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Changing nickname for user ID: " + id + " to: " + request.getNewNickname());
        var result = service.changeNickname(id, request);
        System.out.println("Nickname changed successfully.");
        return result;
    }

    @PutMapping("/{id}/email")
    public UserDTO changeEmail(
            @AuthenticationPrincipal UUID authenticatedUserId,
            @PathVariable UUID id,
            @RequestBody ChangeEmailRequestDTO request) {
        assertSameUser(authenticatedUserId, id);
        System.out.println("Changing email for user ID: " + id + " to: " + request.getNewEmail());
        var result = service.changeEmail(id, request);
        System.out.println("Email changed successfully.");
        return result;
    }
}
