package com.user_service.user_service.controller.query;

import com.user_service.user_service.dto.UserDTO;
import com.user_service.user_service.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserQueryController {
    private final UserQueryService userQueryService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @AuthenticationPrincipal UUID authenticatedUserId, @PathVariable UUID id) {
        if (authenticatedUserId == null || !authenticatedUserId.equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        System.out.println("Fetching user with ID: " + id);
        var user = userQueryService.getUserById(id);
        System.out.println("Fetched user: " + user);
        return ResponseEntity.ok(user);
    }
}
