package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.dto.ui.BudgetCreateRequestUiDTO;
import com.bff.bff.dto.ui.BudgetUiDTO;
import com.bff.bff.dto.ui.SetDefaultBudgetsRequestUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/budgets")
@RequiredArgsConstructor
public class BudgetCommandController {
    private final BudgetServiceClient budgetServiceClient;
    private final MapperExtension mapperExtension;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetUiDTO createBudget(@RequestBody BudgetCreateRequestUiDTO request) {
        var requestDto = mapperExtension.toBudgetCreateRequestDTO(request);
        var resultDto = budgetServiceClient.createBudget(requestDto);
        return mapperExtension.toBudgetUiDTO(resultDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBudget(@PathVariable UUID id) {
        budgetServiceClient.deleteBudget(id);
    }

    @PostMapping("/set-default")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setDefaultBudget(@RequestBody SetDefaultBudgetsRequestUiDTO requestUiDTO) {
        budgetServiceClient.setDefaultBudgets(mapperExtension.toSetDefaultBudgetsRequestDTO(requestUiDTO));
    };
}
