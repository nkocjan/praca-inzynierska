package com.bff.bff.controller;

import com.bff.bff.dto.api.AuthRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthProxyController {

    private final RestTemplate restTemplate;
    private final String userServiceUrl;

    public AuthProxyController(
            RestTemplate restTemplate, @Value("${user-service.url}") String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequestDTO authRequest) {
        log.info("Login attempt for user: {}", authRequest.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AuthRequestDTO> entity = new HttpEntity<>(authRequest, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    userServiceUrl + "/api/v1/auth/login", entity, String.class);
            // Pass on only the status and body. Copying the upstream headers would repeat its
            // Transfer-Encoding next to Tomcat's own, and the gateway (Caddy) rejects such a response.
            return ResponseEntity.status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("User service unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service unavailable");
        }
    }
}
