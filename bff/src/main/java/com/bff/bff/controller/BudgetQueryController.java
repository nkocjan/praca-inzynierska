package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.dto.api.BudgetDTO;
import com.bff.bff.dto.api.BudgetSearchRequestDTO;
import com.bff.bff.dto.api.GetTotalExpensesAmountRequestDTO;
import com.bff.bff.dto.ui.BudgetUiDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private final ExpenseServiceClient expenseServiceClient;
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
    public Page<BudgetUiDTO> searchBudgets(@RequestBody BudgetSearchRequestDTO request, Pageable pageable) {
        Page<BudgetDTO> page = budgetServiceClient.searchBudgets(request, pageable);
        Map<UUID, BigDecimal> spentByBudget = spentAmounts(page.getContent());
        return page.map(budget -> {
            BudgetUiDTO uiDto = mapperExtension.toBudgetUiDTO(budget);
            uiDto.setSpentAmount(spentByBudget.getOrDefault(budget.getId(), BigDecimal.ZERO));
            return uiDto;
        });
    }

    @GetMapping("/get-defaults/{categoryId}")
    public GetDefaultBudgetsResponseUiDTO getDefaultBudgets(@PathVariable UUID categoryId) {
        return mapperExtension.toGetDefaultBudgetsResponseUiDTO(budgetServiceClient.getDefaultBudgets(categoryId));
    }

    // One sum query per distinct period on the page: budgets of the same week, month or year share it.
    private Map<UUID, BigDecimal> spentAmounts(List<BudgetDTO> budgets) {
        Map<UUID, BigDecimal> spentByBudget = new HashMap<>();
        Map<List<LocalDateTime>, List<BudgetDTO>> byPeriod = budgets.stream()
                .filter(budget -> budget.getPeriodStart() != null && budget.getPeriodEnd() != null && budget.getCategory() != null)
                .collect(Collectors.groupingBy(budget -> List.of(budget.getPeriodStart(), budget.getPeriodEnd())));

        byPeriod.forEach((period, periodBudgets) -> {
            GetTotalExpensesAmountRequestDTO sumRequest = new GetTotalExpensesAmountRequestDTO();
            sumRequest.setCategoryIds(periodBudgets.stream().map(budget -> budget.getCategory().getId()).distinct().toList());
            sumRequest.setDateFrom(period.get(0));
            sumRequest.setDateTo(period.get(1));
            Map<UUID, BigDecimal> spentByCategory = Objects.requireNonNullElse(
                    expenseServiceClient.getTotalExpensesAmount(sumRequest), Map.of());
            periodBudgets.forEach(budget -> spentByBudget.put(
                    budget.getId(), spentByCategory.getOrDefault(budget.getCategory().getId(), BigDecimal.ZERO)));
        });
        return spentByBudget;
    }
}
