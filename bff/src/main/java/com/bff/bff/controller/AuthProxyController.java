package com.bff.bff.controller;

import com.bff.bff.dto.api.AuthRequestDTO;
import com.bff.bff.security.FailedAttemptLimiter;
import jakarta.servlet.http.HttpServletRequest;
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
    private final FailedAttemptLimiter failedAttemptLimiter;

    public AuthProxyController(
            RestTemplate restTemplate,
            @Value("${user-service.url}") String userServiceUrl,
            FailedAttemptLimiter failedAttemptLimiter) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
        this.failedAttemptLimiter = failedAttemptLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody AuthRequestDTO authRequest, HttpServletRequest request) {
        log.info("Login attempt for user: {}", authRequest.getUsername());
        // The address is the visitor's own behind the gateway (server.forward-headers-strategy).
        var addressKey = "login:" + request.getRemoteAddr();
        var accountKey = addressKey + ":" + authRequest.getUsername();
        failedAttemptLimiter.assertNotBlocked(accountKey, FailedAttemptLimiter.MAX_WRONG_PASSWORDS);
        failedAttemptLimiter.assertNotBlocked(
                addressKey, FailedAttemptLimiter.MAX_FAILED_LOGINS_PER_ADDRESS);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AuthRequestDTO> entity = new HttpEntity<>(authRequest, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    userServiceUrl + "/api/v1/auth/login", entity, String.class);
            // Only this login's counter: a successful login to one's own account must not let
            // someone go on guessing other logins from the same address.
            failedAttemptLimiter.reset(accountKey);
            // Pass on only the status and body. Copying the upstream headers would repeat its
            // Transfer-Encoding next to Tomcat's own, and the gateway (Caddy) rejects such a response.
            return ResponseEntity.status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());
        } catch (HttpStatusCodeException e) {
            if (e.getStatusCode().isSameCodeAs(HttpStatus.UNAUTHORIZED)) {
                failedAttemptLimiter.recordFailure(accountKey);
                failedAttemptLimiter.recordFailure(addressKey);
            }
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("User service unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service unavailable");
        }
    }
}
