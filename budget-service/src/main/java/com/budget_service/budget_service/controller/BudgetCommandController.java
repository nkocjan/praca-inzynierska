package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.BudgetCreateRequestDTO;
import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.dto.SetDefaultBudgetsRequestDTO;
import com.budget_service.budget_service.service.BudgetCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
public class BudgetCommandController {
    private final BudgetCommandService budgetCommandService;

    private static void assertSameUser(UUID headerUserId, UUID pathUserId) {
        if (headerUserId == null || pathUserId == null || !headerUserId.equals(pathUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @PostMapping
    public BudgetDTO create(@RequestBody BudgetCreateRequestDTO dto) {
        return budgetCommandService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        budgetCommandService.delete(id);
    }

    @PostMapping("/set-default")
    public void setDefaultBudgets(@RequestBody SetDefaultBudgetsRequestDTO requestDTO, @RequestHeader("X-User-Id") UUID userId) {
        budgetCommandService.setDefaultBudgets(requestDTO, userId);
    }

    @DeleteMapping("/user/{userId}/data")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetData(@PathVariable UUID userId, @RequestHeader("X-User-Id") UUID headerUserId) {
        assertSameUser(headerUserId, userId);
        budgetCommandService.resetData(userId);
    }
}
