package com.bff.bff.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bff.bff.dto.api.AuthRequestDTO;
import com.bff.bff.security.FailedAttemptLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

class AuthProxyControllerTest {

    private static final String LOGIN_URL = "http://user-service/api/v1/auth/login";

    private final RestTemplate restTemplate = mock(RestTemplate.class);
    private final AuthProxyController controller =
            new AuthProxyController(restTemplate, "http://user-service", new FailedAttemptLimiter());

    private static AuthRequestDTO credentials(String username, String password) {
        var request = new AuthRequestDTO();
        request.setUsername(username);
        request.setPassword(password);
        return request;
    }

    private static MockHttpServletRequest from(String address) {
        var request = new MockHttpServletRequest();
        request.setRemoteAddr(address);
        return request;
    }

    // user-service answers 401 for every login in these tests
    private void rejectAllLogins() {
        when(restTemplate.postForEntity(eq(LOGIN_URL), any(HttpEntity.class), eq(String.class)))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null));
    }

    private int login(String username, String address) {
        return controller.login(credentials(username, "wrong"), from(address)).getStatusCode().value();
    }

    @Test
    void sixthWrongPasswordForTheSameLoginIsRefusedWithoutAskingUserService() {
        rejectAllLogins();
        for (int i = 0; i < FailedAttemptLimiter.MAX_WRONG_PASSWORDS; i++) {
            assertEquals(401, login("jan", "203.0.113.7"));
        }

        var ex = assertThrows(ResponseStatusException.class, () -> login("jan", "203.0.113.7"));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
        verify(restTemplate, times(FailedAttemptLimiter.MAX_WRONG_PASSWORDS))
                .postForEntity(anyString(), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void theSameLoginFromAnotherAddressIsNotBlocked() {
        rejectAllLogins();
        for (int i = 0; i < FailedAttemptLimiter.MAX_WRONG_PASSWORDS; i++) {
            login("jan", "203.0.113.7");
        }

        assertEquals(401, login("jan", "198.51.100.4"));
    }

    @Test
    void oneAddressTryingManyLoginsIsBlockedToo() {
        rejectAllLogins();
        for (int i = 0; i < FailedAttemptLimiter.MAX_FAILED_LOGINS_PER_ADDRESS; i++) {
            assertEquals(401, login("user" + i, "203.0.113.7"));
        }

        var ex = assertThrows(ResponseStatusException.class, () -> login("someone-new", "203.0.113.7"));
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
    }

    @Test
    void aSuccessfulLoginClearsTheCountOfThatLogin() {
        when(restTemplate.postForEntity(eq(LOGIN_URL), any(HttpEntity.class), eq(String.class)))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null))
                .thenReturn(ResponseEntity.ok("{\"token\":\"t\"}"))
                .thenThrow(HttpClientErrorException.create(HttpStatus.UNAUTHORIZED, "Unauthorized", null, null, null));
        for (int i = 0; i < 4; i++) {
            login("jan", "203.0.113.7");
        }
        assertEquals(200, login("jan", "203.0.113.7"));

        // four more failures would have reached the limit without the reset
        for (int i = 0; i < 4; i++) {
            assertEquals(401, login("jan", "203.0.113.7"));
        }
    }
}
