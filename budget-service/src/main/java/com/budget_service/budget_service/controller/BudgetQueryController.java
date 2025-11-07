package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.dto.BudgetSearchRequestDTO;
import com.budget_service.budget_service.dto.GetDefaultBudgetsResponseDTO;
import com.budget_service.budget_service.service.BudgetQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
public class BudgetQueryController {
    private final BudgetQueryService budgetQueryService;

    @GetMapping
    public List<BudgetDTO> getAll(@RequestHeader("X-User-Id") UUID userId) {
        return budgetQueryService.findAllByUser(userId);
    }

    @PostMapping("/search")
    public Page<BudgetDTO> searchBudgets(
            @RequestBody BudgetSearchRequestDTO requestDTO,
            @RequestHeader("X-User-Id") UUID userId,
            @PageableDefault(size = 10, sort = "periodStart") Pageable pageable
    ) {
        return budgetQueryService.searchBudgets(requestDTO, userId, pageable);
    }

    @GetMapping("/by-ids")
    public List<BudgetDTO> getByIds(
            @RequestParam List<UUID> ids,
            @RequestHeader("X-User-Id") UUID userId
    ) {
        return budgetQueryService.findByIdsAndUser(ids, userId);
    }

    @GetMapping("/{id}")
    public BudgetDTO getById(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID userId) {
        return budgetQueryService.getById(id, userId);
    }

    @GetMapping("/get-default/{categoryId}")
    public GetDefaultBudgetsResponseDTO getDefaultBudgets(@PathVariable UUID categoryId, @RequestHeader("X-User-Id") UUID userId) {
        return budgetQueryService.getDefaultBudgets(categoryId, userId);
    }
}
