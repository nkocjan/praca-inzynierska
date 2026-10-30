package com.user_service.user_service.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

import com.user_service.user_service.entity.UserEntity;
import com.user_service.user_service.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class UserValidatorTest {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserValidator validator = new UserValidator(mock(UserRepository.class), passwordEncoder);

    private UserEntity userWithPassword(String password) {
        var user = new UserEntity();
        user.setPassword(passwordEncoder.encode(password));
        return user;
    }

    @Test
    void acceptsTheCurrentPassword() {
        assertDoesNotThrow(() -> validator.validatePassword(userWithPassword("secret123"), "secret123"));
    }

    @Test
    void rejectsAWrongPassword() {
        assertThrows(IllegalArgumentException.class,
                () -> validator.validatePassword(userWithPassword("secret123"), "secret124"));
    }

    @Test
    void rejectsAMissingPassword() {
        assertThrows(IllegalArgumentException.class,
                () -> validator.validatePassword(userWithPassword("secret123"), null));
    }
}
