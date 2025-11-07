package com.user_service.user_service.service;

import com.user_service.user_service.dto.*;
import com.user_service.user_service.entity.UserEntity;
import com.user_service.user_service.mappers.UserMapper;
import com.user_service.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserCommandService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;

    public UserDTO createUser(UserCreateRequestDTO request) {
        userValidator.validateForCreate(request);
        UserEntity entity = mapper.createUserEntityFromDTO(request);
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        var savedUser = userRepository.save(entity);

        return mapper.toUserDTO(savedUser);
    }

    public UserDTO updateUser(UUID id, UserUpdateRequestDTO request) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userValidator.validateForUpdate(id, request);
        mapper.updateEntityFromDto(request, user);
        UserEntity updatedUser = userRepository.save(user);

        return mapper.toUserDTO(updatedUser);
    }

    public UserDTO activateAccount(UUID userId, ActivateAccountRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userValidator.validateForActivate(user, request.getIsActive());
        user.setIsActive(Boolean.parseBoolean(request.getIsActive()));
        UserEntity entity =  userRepository.save(user);

        return mapper.toUserDTO(entity);
    }

    public UserDTO setPremium(UUID userId, SetPremiumRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userValidator.validateForSetPremium(user, request.getIsPremium());
        user.setIsPremium(Boolean.parseBoolean(request.getIsPremium()));
        UserEntity entity =  userRepository.save(user);

        return mapper.toUserDTO(entity);
    }

    public void changePassword(UUID userId, ChangePasswordRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userValidator.validateForChangePassword(user, request);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteUser(UUID userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userValidator.validateForDelete(user);
        userRepository.deleteById(userId);
    }
}
