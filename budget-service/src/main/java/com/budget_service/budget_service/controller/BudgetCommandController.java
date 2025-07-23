package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.BudgetCreateRequestDTO;
import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.service.BudgetCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
public class BudgetCommandController {
    private final BudgetCommandService budgetCommandService;

    @PostMapping
    public BudgetDTO create(@RequestBody BudgetCreateRequestDTO dto) {
        return budgetCommandService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, @RequestParam UUID userId) {
        budgetCommandService.delete(id, userId);
    }
}
