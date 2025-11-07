package com.user_service.user_service.service;

import com.user_service.user_service.dto.*;
import com.user_service.user_service.entity.UserEntity;
import com.user_service.user_service.exception.UserAlreadyExistsException;
import com.user_service.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class UserValidator {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void validateForCreate(UserCreateRequestDTO request) {
        validateCommonFields(request.getUsername(), request.getName(), request.getSurname(), request.getEmail(), request.getPhoneNumber());
        if (request.getPassword() == null || request.getPassword().length() < 8)
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        validateEmailFormat(request.getEmail());
        validatePhoneFormat(request.getPhoneNumber());
        var existing = userRepository.findFirstByUsernameOrEmailOrPhoneNumber(
                request.getUsername(), request.getEmail(), request.getPhoneNumber()
        );
        existing.ifPresent(userEntity -> throwIfDuplicate(userEntity, request.getUsername(), request.getEmail(), request.getPhoneNumber()));
    }

    public void validateForUpdate(UUID userId, UserUpdateRequestDTO request) {
        validateCommonFields(request.getUsername(), request.getName(), request.getSurname(), request.getEmail(), request.getPhoneNumber());
        validateEmailFormat(request.getEmail());
        validatePhoneFormat(request.getPhoneNumber());
        Optional<UserEntity> existing = userRepository.findFirstByUsernameOrEmailOrPhoneNumber(
                request.getUsername(), request.getEmail(), request.getPhoneNumber()
        );
        if (existing.isPresent() && !existing.get().getId().equals(userId)) {
            throwIfDuplicate(existing.get(), request.getUsername(), request.getEmail(), request.getPhoneNumber());
        }
    }

    public void validateForActivate(UserEntity user, String isActive) {
        if (user == null) throw new IllegalArgumentException("User not found");
        if (isActive == null) throw new IllegalArgumentException("isActive cannot be null");
        if (user.getIsActive() != null && user.getIsActive().toString().equals(isActive))
            throw new IllegalArgumentException("User already has isActive=" + isActive);
    }

    public void validateForSetPremium(UserEntity user, String isPremium) {
        if (user == null) throw new IllegalArgumentException("User not found");
        if (isPremium == null) throw new IllegalArgumentException("isPremium cannot be null");
        if (user.getIsPremium() != null && user.getIsPremium().toString().equals(isPremium))
            throw new IllegalArgumentException("User already has isPremium=" + isPremium);
    }

    public void validateForChangePassword(UserEntity user, ChangePasswordRequestDTO request) {
        if (user == null) throw new IllegalArgumentException("User not found");
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        if (request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }
    }

    public void validateForDelete(UserEntity user) {
        if (user == null) throw new IllegalArgumentException("User not found");
    }

    private void validateCommonFields(String username, String name, String surname, String email, String phoneNumber) {
        if (username == null || username.length() < 3)
            throw new IllegalArgumentException("Username must be at least 3 characters long");
        if (name == null || name.length() < 3)
            throw new IllegalArgumentException("Name must be at least 3 characters long");
        if (surname == null || surname.length() < 3)
            throw new IllegalArgumentException("Surname must be at least 3 characters long");
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("Email cannot be empty");
        if (phoneNumber == null || phoneNumber.isBlank())
            throw new IllegalArgumentException("Phone number cannot be empty");
    }

    private void validateEmailFormat(String email) {
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        if (!emailPattern.matcher(email).matches())
            throw new IllegalArgumentException("Invalid email format");
    }

    private void validatePhoneFormat(String phoneNumber) {
        Pattern phonePattern = Pattern.compile("^[0-9]{9,}$");
        if (!phonePattern.matcher(phoneNumber).matches())
            throw new IllegalArgumentException("Invalid phone number format");
    }

    private void throwIfDuplicate(UserEntity user, String username, String email, String phoneNumber) {
        if (user.getUsername().equals(username))
            throw new UserAlreadyExistsException("User with username '" + username + "' already exists");
        if (user.getEmail().equals(email))
            throw new UserAlreadyExistsException("User with email '" + email + "' already exists");
        if (user.getPhoneNumber().equals(phoneNumber))
            throw new UserAlreadyExistsException("User with phone number '" + phoneNumber + "' already exists");
    }
}
