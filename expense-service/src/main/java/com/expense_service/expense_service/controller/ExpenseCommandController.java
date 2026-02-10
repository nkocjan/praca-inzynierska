package com.expense_service.expense_service.controller;

import com.expense_service.expense_service.dto.CreateExpenseRequestDTO;
import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.ResetCategoriesRequestDTO;
import com.expense_service.expense_service.dto.UpdateExpenseRequestDTO;
import com.expense_service.expense_service.service.ExpenseCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseCommandController {
    private final ExpenseCommandService expenseCommandService;

    private static void assertSameUser(UUID headerUserId, UUID pathUserId) {
        if (headerUserId == null || pathUserId == null || !headerUserId.equals(pathUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseDTO createExpense(@RequestBody CreateExpenseRequestDTO request, @RequestHeader("X-User-Id") UUID userId) {
        return expenseCommandService.createExpense(request, userId);
    }

    @PutMapping("/{expenseId}/planned")
    @ResponseStatus(HttpStatus.OK)
    public ExpenseDTO setAsPlanned(@PathVariable UUID expenseId, @RequestParam boolean isPlanned, @RequestHeader("X-User-Id") UUID userId) {
        return expenseCommandService.setAsPlanned(expenseId, isPlanned, userId);
    }

    @PutMapping("/{expenseId}")
    public ExpenseDTO updateExpense(@PathVariable UUID expenseId, @RequestBody UpdateExpenseRequestDTO request,  @RequestHeader("X-User-Id") UUID userId) {
        return expenseCommandService.updateExpense(expenseId, request, userId);
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable UUID expenseId,  @RequestHeader("X-User-Id") UUID userId) {
        expenseCommandService.deleteExpense(expenseId, userId);
    }

    @DeleteMapping("/user/{userId}/data")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetData(@PathVariable UUID userId, @RequestHeader("X-User-Id") UUID headerUserId) {
        assertSameUser(headerUserId, userId);
        expenseCommandService.resetData(userId);
    }

    @PostMapping("/user/{userId}/reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetSelectedCategories(
            @PathVariable UUID userId,
            @RequestBody ResetCategoriesRequestDTO request,
            @RequestHeader("X-User-Id") UUID headerUserId) {
        assertSameUser(headerUserId, userId);
        expenseCommandService.resetSelectedCategories(userId, request);
    }
}
