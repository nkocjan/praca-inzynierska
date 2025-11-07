package com.bff.bff.controller;

import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.dto.ui.CreateExpenseRequestUiDTO;
import com.bff.bff.dto.ui.ExpenseUiDTO;
import com.bff.bff.dto.ui.UpdateExpenseRequestUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/expenses")
@RequiredArgsConstructor
public class ExpenseCommandController {

    private final ExpenseServiceClient expenseServiceClient;
    private final MapperExtension mapperExtension;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseUiDTO createExpense(@RequestBody CreateExpenseRequestUiDTO request) {
        var requestDto = mapperExtension.toCreateExpenseRequestDTO(request);
        return mapperExtension.toExpenseUiDTO(expenseServiceClient.createExpense(requestDto));
    }

    @PutMapping("/{expenseId}/planned")
    @ResponseStatus(HttpStatus.OK)
    public ExpenseUiDTO setAsPlanned(
            @PathVariable UUID expenseId, @RequestParam Boolean isPlanned) {
        return mapperExtension.toExpenseUiDTO(
                expenseServiceClient.setAsPlanned(expenseId, isPlanned));
    }

    @PutMapping("/{expenseId}")
    public ExpenseUiDTO updateExpense(
            @PathVariable UUID expenseId, @RequestBody UpdateExpenseRequestUiDTO request) {
        return mapperExtension.toExpenseUiDTO(
                expenseServiceClient.updateExpense(
                        expenseId, mapperExtension.toUpdateExpenseRequestDTO(request)));
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable UUID expenseId) {
        expenseServiceClient.deleteExpense(expenseId);
    }
}
