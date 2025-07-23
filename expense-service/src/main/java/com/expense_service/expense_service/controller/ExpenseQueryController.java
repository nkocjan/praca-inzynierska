package com.expense_service.expense_service.controller;

import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.service.ExpenseQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseQueryController {
    private final ExpenseQueryService expenseQueryService;

    @PostMapping("/search")
    public Page<ExpenseDTO> searchExpenses(@RequestBody ExpenseSearchRequestDTO request, @PageableDefault(size = 10) Pageable pageable) {
        return expenseQueryService.searchExpenses(request, pageable);
    }

    @GetMapping("/{expenseId}")
    public ExpenseDTO getExpenseById(@PathVariable UUID expenseId) {
        return expenseQueryService.getExpenseById(expenseId);
    }
}
