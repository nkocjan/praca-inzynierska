package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.client.UserServiceClient;
import com.bff.bff.dto.api.*;
import com.bff.bff.dto.ui.UserUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/users")
@RequiredArgsConstructor
public class UserCommandController {

    private final UserServiceClient userServiceClient;
    private final BudgetServiceClient budgetServiceClient;
    private final ExpenseServiceClient expenseServiceClient;
    private final MapperExtension mapperExtension;

    // Demo accounts are shared by all visitors, so wiping their data is not allowed.
    private void assertNotDemoAccount(UUID userId) {
        if (Boolean.TRUE.equals(userServiceClient.getUserById(userId).getIsDemo())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Demo account data cannot be reset");
        }
    }

    // Settings changes are confirmed with the current password, so a stolen token alone cannot
    // change the login or e-mail, wipe the data or delete the account. A wrong password is a 400
    // from user-service: the UI reads 403 as "this is a demo account".
    private void assertPassword(UUID userId, String password) {
        var request = new VerifyPasswordRequestDTO();
        request.setPassword(password);
        userServiceClient.verifyPassword(userId, request);
    }

    // Resetting the data and deleting the account also ask for the account's e-mail.
    private void assertCredentials(UUID userId, ConfirmCredentialsRequestDTO confirm) {
        var email = confirm.getEmail();
        if (email == null
                || !email.trim().equalsIgnoreCase(userServiceClient.getUserById(userId).getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "E-mail does not match the account");
        }
        assertPassword(userId, confirm.getPassword());
    }

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

    // 1. Zmiana nicku
    @PutMapping("/{id}/nickname")
    public ResponseEntity<UserUiDTO> changeNickname(
            @PathVariable UUID id, @RequestBody ChangeNicknameRequestDTO request) {
        var userDTO = userServiceClient.changeNickname(id, request);
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    // --- SETTINGS: endpoints bez jawnego {id} (userId z JWT) ---

    @PutMapping("/me/nickname")
    public ResponseEntity<UserUiDTO> changeNicknameMe(
            @AuthenticationPrincipal UUID userId,
            @RequestBody ChangeNicknameUiRequestDTO request) {

        if (request.getPassword() != null
                && request.getConfirmPassword() != null
                && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hasła nie są takie same");
        }
        assertPassword(userId, request.getPassword());

        var apiRequest = new ChangeNicknameRequestDTO();
        apiRequest.setNewNickname(request.getNewNickname());

        var userDTO = userServiceClient.changeNickname(userId, apiRequest);
        return ResponseEntity.ok(mapperExtension.toUserUiDTO(userDTO));
    }

    // 2. Zmiana emaila
    @PutMapping("/{id}/email")
    public ResponseEntity<UserUiDTO> changeEmail(
            @PathVariable UUID id, @RequestBody ChangeEmailRequestDTO request) {
        var userDTO = userServiceClient.changeEmail(id, request);
        var userUiDTO = mapperExtension.toUserUiDTO(userDTO);
        return ResponseEntity.ok(userUiDTO);
    }

    @PutMapping("/me/email")
    public ResponseEntity<UserUiDTO> changeEmailMe(
            @AuthenticationPrincipal UUID userId,
            @RequestBody ChangeEmailUiRequestDTO request) {

        if (request.getNewEmail() != null
                && request.getConfirmNewEmail() != null
                && !request.getNewEmail().equals(request.getConfirmNewEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Adresy e-mail nie są takie same");
        }
        assertPassword(userId, request.getPassword());

        var apiRequest = new ChangeEmailRequestDTO();
        apiRequest.setNewEmail(request.getNewEmail());

        var userDTO = userServiceClient.changeEmail(userId, apiRequest);
        return ResponseEntity.ok(mapperExtension.toUserUiDTO(userDTO));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePasswordMe(
            @AuthenticationPrincipal UUID userId,
            @RequestBody ChangePasswordRequestDTO request) {
        userServiceClient.changePassword(userId, request);
        return ResponseEntity.noContent().build();
    }

    // 3. Reset danych konta (np. wyczyszczenie wszystkich transakcji i budżetów)
    @PostMapping("/{id}/reset-data")
    public ResponseEntity<Void> resetAccountData(@PathVariable UUID id) {
        assertNotDemoAccount(id);
        budgetServiceClient.resetData(id);
        expenseServiceClient.resetData(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/reset-data")
    public ResponseEntity<Void> resetAccountDataMe(
            @AuthenticationPrincipal UUID userId,
            @RequestBody ConfirmCredentialsRequestDTO confirm) {
        assertNotDemoAccount(userId);
        assertCredentials(userId, confirm);
        budgetServiceClient.resetData(userId);
        expenseServiceClient.resetData(userId);
        return ResponseEntity.noContent().build();
    }

    // 4. Reset wybranych kategorii (przywrócenie do domyślnych lub usunięcie customowych)
    @PostMapping("/{id}/categories/reset")
    public ResponseEntity<Void> resetSelectedCategories(
            @PathVariable UUID id, @RequestBody ResetCategoriesRequestDTO request) {
        budgetServiceClient.resetSelectedCategories(id, request);
        expenseServiceClient.resetSelectedCategories(id, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/categories/reset")
    public ResponseEntity<Void> resetSelectedCategoriesMe(
            @AuthenticationPrincipal UUID userId, @RequestBody ResetCategoriesRequestDTO request) {
        budgetServiceClient.resetSelectedCategories(userId, request);
        expenseServiceClient.resetSelectedCategories(userId, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/delete")
    public ResponseEntity<Void> deleteMe(
            @AuthenticationPrincipal UUID userId,
            @RequestBody ConfirmCredentialsRequestDTO confirm) {
        assertCredentials(userId, confirm);
        userServiceClient.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
