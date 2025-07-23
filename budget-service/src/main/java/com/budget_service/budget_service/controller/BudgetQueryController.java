package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.service.BudgetQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
public class BudgetQueryController {
    private final BudgetQueryService budgetQueryService;

    @GetMapping
    public List<BudgetDTO> getAll(@RequestParam UUID userId) {
        return budgetQueryService.findAllByUser(userId);
    }

    @GetMapping("/by-ids")
    public List<BudgetDTO> getByIds(
            @RequestParam List<UUID> ids,
            @RequestParam UUID userId
    ) {
        return budgetQueryService.findByIdsAndUser(ids, userId);
    }

    @GetMapping("/{id}")
    public BudgetDTO getById(@PathVariable UUID id, @RequestParam UUID userId) {
        return budgetQueryService.getById(id, userId);
    }
}
