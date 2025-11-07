package com.expense_service.expense_service.controller;

import com.expense_service.expense_service.dto.*;
import com.expense_service.expense_service.service.ExpenseQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseQueryController {
    private final ExpenseQueryService expenseQueryService;

    @PostMapping("/search")
    public Page<ExpenseDTO> searchExpenses(@RequestBody ExpenseSearchRequestDTO request, @PageableDefault(size = 10) Pageable pageable, @RequestHeader("X-User-Id") UUID userId) {
        request.setUserId(userId);
        return expenseQueryService.searchExpenses(request, pageable, userId);
    }

    @PostMapping("/sum")
    Map<UUID, BigDecimal> getTotalExpensesAmount(@RequestBody GetTotalExpensesAmountRequestDTO request, @RequestHeader("X-User-Id") UUID userId){
        return expenseQueryService.getTotalExpensesAmount(request, userId);
    };

    @GetMapping("/{expenseId}")
    public ExpenseDTO getExpenseById(@PathVariable UUID expenseId, @RequestHeader("X-User-Id") UUID userId) {
        System.out.println("Fetching expense with ID: " + expenseId);
        var expense = expenseQueryService.getExpenseById(expenseId, userId);
        System.out.println("Fetched expense: " + expense);
        return expense;
    }

    @GetMapping("/dashboard")
    public DashboardDataResponseDTO getDashboardData(@RequestHeader("X-User-Id") UUID userId) {
        return expenseQueryService.getDashboardData(userId);
    }
}
