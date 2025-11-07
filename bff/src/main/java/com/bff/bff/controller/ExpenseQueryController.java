package com.bff.bff.controller;

import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.dto.ui.DashboardDataResponseUiDTO;
import com.bff.bff.dto.ui.ExpenseSearchRequestUiDTO;
import com.bff.bff.dto.ui.ExpenseUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/expenses")
@RequiredArgsConstructor
public class ExpenseQueryController {

    private final ExpenseServiceClient expenseServiceClient;
    private final MapperExtension mapperExtension;

    @PostMapping("/search")
    public Page<ExpenseUiDTO> searchExpenses(
            @RequestBody ExpenseSearchRequestUiDTO request,
            @PageableDefault(size = 10) Pageable pageable) {
        var requestDTO = mapperExtension.toExpenseSearchRequestDTO(request);
        return expenseServiceClient
                .searchExpenses(requestDTO, pageable)
                .map(mapperExtension::toExpenseUiDTO);
    }

    @GetMapping("/{expenseId}")
    public ExpenseUiDTO getExpenseById(@PathVariable UUID expenseId) {
        return mapperExtension.toExpenseUiDTO(expenseServiceClient.getExpenseById(expenseId));
    }

    @GetMapping("/dashboard")
    public DashboardDataResponseUiDTO getDashboardData() {
        return mapperExtension.toDashboardDataResponseUiDTO(
                expenseServiceClient.getExpenseDashboardData());
    }
}
