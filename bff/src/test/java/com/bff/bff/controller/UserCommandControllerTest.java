package com.bff.bff.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.client.UserServiceClient;
import com.bff.bff.dto.api.*;
import com.bff.bff.mapper.MapperExtension;
import com.bff.bff.security.FailedAttemptLimiter;
import feign.FeignException;
import feign.Request;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class UserCommandControllerTest {

    private static final UUID USER_ID = UUID.randomUUID();
    private static final String EMAIL = "jan@example.com";
    private static final String PASSWORD = "secret123";

    @Mock private UserServiceClient userServiceClient;
    @Mock private BudgetServiceClient budgetServiceClient;
    @Mock private ExpenseServiceClient expenseServiceClient;
    @Mock private MapperExtension mapperExtension;
    @Mock private HttpServletRequest httpRequest;
    @Spy private FailedAttemptLimiter failedAttemptLimiter = new FailedAttemptLimiter();

    @InjectMocks private UserCommandController controller;

    private UserDTO user;

    @BeforeEach
    void setUp() {
        user = new UserDTO();
        user.setId(USER_ID);
        user.setEmail(EMAIL);
        user.setIsDemo(false);
        lenient().when(httpRequest.getRemoteAddr()).thenReturn("203.0.113.7");
    }

    // The 400 that user-service answers for a wrong password, as Feign reports it.
    private static FeignException.BadRequest wrongPassword() {
        var request =
                Request.create(
                        Request.HttpMethod.POST, "/verify-password", Map.of(), null, StandardCharsets.UTF_8, null);
        return new FeignException.BadRequest("Password is incorrect", request, null, Map.of());
    }

    private void rejectPassword() {
        doThrow(wrongPassword()).when(userServiceClient).verifyPassword(eq(USER_ID), any());
    }

    private static ConfirmCredentialsRequestDTO confirm(String email, String password) {
        var confirm = new ConfirmCredentialsRequestDTO();
        confirm.setEmail(email);
        confirm.setPassword(password);
        return confirm;
    }

    @Test
    void changeNicknameVerifiesThePasswordFirst() {
        var request = new ChangeNicknameUiRequestDTO();
        request.setNewNickname("nowy");
        request.setPassword(PASSWORD);
        request.setConfirmPassword(PASSWORD);

        controller.changeNicknameMe(USER_ID, request);

        var order = inOrder(userServiceClient);
        order.verify(userServiceClient)
                .verifyPassword(eq(USER_ID), argThat(r -> PASSWORD.equals(r.getPassword())));
        order.verify(userServiceClient).changeNickname(eq(USER_ID), any());
    }

    @Test
    void changeNicknameWithWrongPasswordChangesNothing() {
        rejectPassword();
        var request = new ChangeNicknameUiRequestDTO();
        request.setNewNickname("nowy");
        request.setPassword("wrong");
        request.setConfirmPassword("wrong");

        assertThrows(FeignException.BadRequest.class, () -> controller.changeNicknameMe(USER_ID, request));
        verify(userServiceClient, never()).changeNickname(any(), any());
    }

    private static ChangeNicknameUiRequestDTO nicknameChange(String password) {
        var request = new ChangeNicknameUiRequestDTO();
        request.setNewNickname("nowy");
        request.setPassword(password);
        request.setConfirmPassword(password);
        return request;
    }

    @Test
    void tooManyWrongPasswordsGet429WithoutAskingUserService() {
        rejectPassword();
        for (int i = 0; i < FailedAttemptLimiter.MAX_WRONG_PASSWORDS; i++) {
            assertThrows(
                    FeignException.BadRequest.class,
                    () -> controller.changeNicknameMe(USER_ID, nicknameChange("wrong")));
        }

        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.changeNicknameMe(USER_ID, nicknameChange("wrong")));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
        verify(userServiceClient, times(FailedAttemptLimiter.MAX_WRONG_PASSWORDS))
                .verifyPassword(eq(USER_ID), any());
        verify(userServiceClient, never()).changeNickname(any(), any());
    }

    @Test
    void changePasswordChecksTheOldPasswordFirst() {
        rejectPassword();
        var request = new ChangePasswordRequestDTO();
        request.setOldPassword("wrong");
        request.setNewPassword("Nowe-haslo-1");
        request.setConfirmNewPassword("Nowe-haslo-1");

        assertThrows(FeignException.BadRequest.class, () -> controller.changePasswordMe(USER_ID, request));
        verify(userServiceClient, never()).changePassword(any(), any());
    }

    @Test
    void changeEmailWithWrongPasswordChangesNothing() {
        rejectPassword();
        var request = new ChangeEmailUiRequestDTO();
        request.setNewEmail("nowy@example.com");
        request.setConfirmNewEmail("nowy@example.com");
        request.setPassword("wrong");

        assertThrows(FeignException.BadRequest.class, () -> controller.changeEmailMe(USER_ID, request));
        verify(userServiceClient, never()).changeEmail(any(), any());
    }

    @Test
    void resetDataWithMatchingCredentialsResetsBothServices() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        controller.resetAccountDataMe(USER_ID, confirm("  JAN@example.com ", PASSWORD));

        verify(userServiceClient)
                .verifyPassword(eq(USER_ID), argThat(r -> PASSWORD.equals(r.getPassword())));
        verify(budgetServiceClient).resetData(USER_ID);
        verify(expenseServiceClient).resetData(USER_ID);
    }

    @Test
    void resetDataWithAnotherEmailIsRejected() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.resetAccountDataMe(USER_ID, confirm("inny@example.com", PASSWORD)));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        verify(userServiceClient, never()).verifyPassword(any(), any());
        verify(budgetServiceClient, never()).resetData(any());
        verify(expenseServiceClient, never()).resetData(any());
    }

    @Test
    void resetDataWithWrongPasswordResetsNothing() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);
        rejectPassword();

        assertThrows(
                FeignException.BadRequest.class,
                () -> controller.resetAccountDataMe(USER_ID, confirm(EMAIL, "wrong")));
        verify(budgetServiceClient, never()).resetData(any());
        verify(expenseServiceClient, never()).resetData(any());
    }

    @Test
    void resetDataOfDemoAccountIsStillForbidden() {
        user.setIsDemo(true);
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.resetAccountDataMe(USER_ID, confirm(EMAIL, PASSWORD)));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        verify(budgetServiceClient, never()).resetData(any());
    }

    private void verifyNothingDeleted() {
        verify(expenseServiceClient, never()).resetData(any());
        verify(budgetServiceClient, never()).deleteUserData(any());
        verify(userServiceClient, never()).deleteUser(any());
    }

    @Test
    void deleteRemovesTheDataBeforeTheAccount() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        controller.deleteMe(USER_ID, confirm(EMAIL, PASSWORD));

        var order = inOrder(userServiceClient, expenseServiceClient, budgetServiceClient);
        order.verify(userServiceClient).verifyPassword(eq(USER_ID), any());
        order.verify(expenseServiceClient).resetData(USER_ID);
        order.verify(budgetServiceClient).deleteUserData(USER_ID);
        order.verify(userServiceClient).deleteUser(USER_ID);
    }

    @Test
    void deleteKeepsTheAccountWhenTheDataCannotBeDeleted() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);
        doThrow(new IllegalStateException("budget-service is down"))
                .when(budgetServiceClient)
                .deleteUserData(USER_ID);

        assertThrows(IllegalStateException.class, () -> controller.deleteMe(USER_ID, confirm(EMAIL, PASSWORD)));
        verify(userServiceClient, never()).deleteUser(any());
    }

    @Test
    void deleteWithWrongPasswordKeepsTheAccount() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);
        rejectPassword();

        assertThrows(FeignException.BadRequest.class, () -> controller.deleteMe(USER_ID, confirm(EMAIL, "wrong")));
        verifyNothingDeleted();
    }

    @Test
    void deleteWithoutEmailIsRejected() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.deleteMe(USER_ID, confirm(null, PASSWORD)));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        verifyNothingDeleted();
    }

    @Test
    void deleteOfDemoAccountIsForbidden() {
        user.setIsDemo(true);
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.deleteMe(USER_ID, confirm(EMAIL, PASSWORD)));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        verify(userServiceClient, never()).verifyPassword(any(), any());
        verifyNothingDeleted();
    }
}
