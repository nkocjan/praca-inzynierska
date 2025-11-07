package com.user_service.user_service.controller.query;

import com.user_service.user_service.dto.AuthRequest;
import com.user_service.user_service.dto.AuthResponse;
import com.user_service.user_service.entity.UserEntity;
import com.user_service.user_service.repository.UserRepository;
import com.user_service.user_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public AuthResponse createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        System.out.println("Attempting to authenticate user: " + authRequest.getUsername());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new Exception("Incorrect login or password", e);
        }
        System.out.println("Authentication successful for user: " + authRequest.getUsername());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final UserEntity userEntity = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new Exception("User not found"));
        System.out.println("Generating token for user: " + userDetails.getUsername() + " with ID: " + userEntity.getId());
        String token = jwtUtil.generateToken(userDetails.getUsername(), userEntity.getId());
        System.out.println("Generated token: " + token);
        return new AuthResponse(token);
    }
}