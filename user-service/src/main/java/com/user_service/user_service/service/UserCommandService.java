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

    public UserDTO createUser(UserCreateRequestDTO request) {
        UserEntity entity = mapper.createUserEntityFromDTO(request);
        var savedUser = userRepository.save(entity);
        return mapper.toUserDTO(savedUser);
    }

    public UserDTO updateUser(UUID id, UserUpdateRequestDTO request) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        mapper.updateEntityFromDto(request, user);
        UserEntity updatedUser = userRepository.save(user);
        return mapper.toUserDTO(updatedUser);
    }

    public UserDTO activateAccount(UUID userId, ActivateAccountRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setIsActive(Boolean.parseBoolean(request.getIsActive()));
        UserEntity entity =  userRepository.save(user);
        return mapper.toUserDTO(entity);
    }

    public UserDTO setPremium(UUID userId, SetPremiumRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setIsPremium(Boolean.parseBoolean(request.getIsPremium()));
        UserEntity entity =  userRepository.save(user);
        return mapper.toUserDTO(entity);
    }

    public void changePassword(UUID userId, ChangePasswordRequestDTO request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
    }
}
