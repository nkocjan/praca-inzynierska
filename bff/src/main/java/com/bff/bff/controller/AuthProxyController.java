package com.bff.bff.controller;

import com.bff.bff.dto.api.AuthRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthProxyController {

    private final RestTemplate restTemplate;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequestDTO authRequest) {
        System.out.println(
                "Received auth request: " + authRequest.getUsername() + authRequest.getPassword());
        String userApiUrl = "http://localhost:8081/api/v1/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AuthRequestDTO> entity = new HttpEntity<>(authRequest, headers);
        System.out.println("Forwarding request to User API at: " + userApiUrl);
        try {
            ResponseEntity<String> response =
                    restTemplate.postForEntity(userApiUrl, entity, String.class);
            System.out.println(
                    "Received response from User API: "
                            + response.getStatusCode()
                            + " "
                            + response.getBody());
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("Exception while calling User API: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception: " + e.getMessage());
        }
    }
}
