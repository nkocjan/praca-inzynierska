package com.bff.bff.client;

import com.bff.bff.dto.api.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "expense-service", url = "${expense-service.url}")
public interface ExpenseServiceClient {

    @PostMapping("/api/v1/expenses")
    ExpenseDTO createExpense(@RequestBody CreateExpenseRequestDTO request);

    @PutMapping("/api/v1/expenses/{expenseId}/planned")
    ExpenseDTO setAsPlanned(
            @PathVariable("expenseId") UUID expenseId, @RequestParam boolean isPlanned);

    @PutMapping("/api/v1/expenses/{expenseId}")
    ExpenseDTO updateExpense(
            @PathVariable("expenseId") UUID expenseId,
            @RequestBody UpdateExpenseRequestDTO request);

    @DeleteMapping("/api/v1/expenses/{expenseId}")
    void deleteExpense(@PathVariable("expenseId") UUID expenseId);

    @PostMapping("/api/v1/expenses/search")
    Page<ExpenseDTO> searchExpenses(
            @RequestBody ExpenseSearchRequestDTO request, Pageable pageable);

    @GetMapping("/api/v1/expenses/{expenseId}")
    ExpenseDTO getExpenseById(@PathVariable("expenseId") UUID expenseId);

    @PostMapping("/api/v1/expenses/sum")
    Map<UUID, BigDecimal> getTotalExpensesAmount(
            @RequestBody GetTotalExpensesAmountRequestDTO request);

    @GetMapping("/api/v1/expenses/dashboard")
    DashboardDataResponseDTO getExpenseDashboardData();

        @DeleteMapping("/api/v1/expenses/user/{userId}/data")
        void resetData(@PathVariable("userId") UUID userId);

        @PostMapping("/api/v1/expenses/user/{userId}/reset")
        void resetSelectedCategories(
                        @PathVariable("userId") UUID userId, @RequestBody ResetCategoriesRequestDTO request);
}
