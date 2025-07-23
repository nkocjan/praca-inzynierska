package com.user_service.user_service.service;

import com.user_service.user_service.dto.UserDTO;
import com.user_service.user_service.entity.UserEntity;
import com.user_service.user_service.mappers.UserMapper;
import com.user_service.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserQueryService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserDTO getUserById(UUID userId) {
        UserEntity entity= userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return userMapper.toUserDTO(entity);
    }
}
