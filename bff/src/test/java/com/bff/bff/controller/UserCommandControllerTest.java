package com.bff.bff.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.client.UserServiceClient;
import com.bff.bff.dto.api.*;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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

    @InjectMocks private UserCommandController controller;

    private UserDTO user;

    @BeforeEach
    void setUp() {
        user = new UserDTO();
        user.setId(USER_ID);
        user.setEmail(EMAIL);
        user.setIsDemo(false);
    }

    // Stands in for the 400 that user-service answers for a wrong password.
    private void rejectPassword() {
        doThrow(new IllegalStateException("Password is incorrect"))
                .when(userServiceClient)
                .verifyPassword(eq(USER_ID), any());
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

        assertThrows(IllegalStateException.class, () -> controller.changeNicknameMe(USER_ID, request));
        verify(userServiceClient, never()).changeNickname(any(), any());
    }

    @Test
    void changeEmailWithWrongPasswordChangesNothing() {
        rejectPassword();
        var request = new ChangeEmailUiRequestDTO();
        request.setNewEmail("nowy@example.com");
        request.setConfirmNewEmail("nowy@example.com");
        request.setPassword("wrong");

        assertThrows(IllegalStateException.class, () -> controller.changeEmailMe(USER_ID, request));
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
                IllegalStateException.class,
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

    @Test
    void deleteWithMatchingCredentialsDeletesTheAccount() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);

        controller.deleteMe(USER_ID, confirm(EMAIL, PASSWORD));

        var order = inOrder(userServiceClient);
        order.verify(userServiceClient).verifyPassword(eq(USER_ID), any());
        order.verify(userServiceClient).deleteUser(USER_ID);
    }

    @Test
    void deleteWithWrongPasswordKeepsTheAccount() {
        when(userServiceClient.getUserById(USER_ID)).thenReturn(user);
        rejectPassword();

        assertThrows(IllegalStateException.class, () -> controller.deleteMe(USER_ID, confirm(EMAIL, "wrong")));
        verify(userServiceClient, never()).deleteUser(any());
    }

    @Test
    void deleteWithoutEmailIsRejected() {
        var ex =
                assertThrows(
                        ResponseStatusException.class,
                        () -> controller.deleteMe(USER_ID, confirm(null, PASSWORD)));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        verify(userServiceClient, never()).deleteUser(any());
    }
}
