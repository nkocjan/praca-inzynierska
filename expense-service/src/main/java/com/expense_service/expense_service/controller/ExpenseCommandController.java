package com.expense_service.expense_service.controller;

import com.expense_service.expense_service.dto.CreateExpenseRequestDTO;
import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.UpdateExpenseRequestDTO;
import com.expense_service.expense_service.service.ExpenseCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseCommandController {
    private final ExpenseCommandService expenseCommandService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseDTO createExpense(@RequestBody CreateExpenseRequestDTO request) {
        return expenseCommandService.createExpense(request);
    }

    @PutMapping("/{expenseId}/planned")
    @ResponseStatus(HttpStatus.OK)
    public ExpenseDTO setAsPlanned(@PathVariable UUID expenseId, @RequestParam boolean isPlanned) {
        return expenseCommandService.setAsPlanned(expenseId, isPlanned);
    }

    @PutMapping("/{expenseId}")
    public ExpenseDTO updateExpense(@PathVariable UUID expenseId, @RequestBody UpdateExpenseRequestDTO request) {
        return expenseCommandService.updateExpense(expenseId, request);
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable UUID expenseId) {
        expenseCommandService.deleteExpense(expenseId);
    }
}
