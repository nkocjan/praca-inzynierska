package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.dto.api.BudgetDTO;
import com.bff.bff.dto.api.BudgetSearchRequestDTO;
import java.util.List;
import java.util.UUID;

import com.bff.bff.dto.ui.GetDefaultBudgetsResponseUiDTO;
import com.bff.bff.mapper.MapperExtension;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bff/budgets")
public class BudgetQueryController {
    private final BudgetServiceClient budgetServiceClient;
    private final MapperExtension mapperExtension;

    @GetMapping
    public List<BudgetDTO> getAllBudgets() {
        return budgetServiceClient.getAllBudgets();
    }

    @GetMapping("/{id}")
    public BudgetDTO getBudgetById(@PathVariable UUID id) {
        return budgetServiceClient.getBudgetById(id);
    }

    @PostMapping("/search")
    public Page<BudgetDTO> searchBudgets(@RequestBody BudgetSearchRequestDTO request, Pageable pageable) {
        return budgetServiceClient.searchBudgets(request, pageable);
    }

    @GetMapping("/get-defaults/{categoryId}")
    public GetDefaultBudgetsResponseUiDTO getDefaultBudgets(@PathVariable UUID categoryId) {
        return mapperExtension.toGetDefaultBudgetsResponseUiDTO(budgetServiceClient.getDefaultBudgets(categoryId));
    }
}
