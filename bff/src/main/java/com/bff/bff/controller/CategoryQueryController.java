package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.dto.BudgetType;
import com.bff.bff.dto.api.CategoryDTO;
import com.bff.bff.dto.api.GetTotalExpensesAmountRequestDTO;
import com.bff.bff.dto.ui.CategoryUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bff/categories")
public class CategoryQueryController {
    private final BudgetServiceClient budgetServiceClient;
    private final ExpenseServiceClient expenseServiceClient;
    private final MapperExtension mapperExtension;

    @GetMapping
    public List<CategoryUiDTO> getAllCategories() {
        List<CategoryDTO> categories = budgetServiceClient.getAllCategories();
        if (categories == null || categories.isEmpty()) {
            return List.of();
        }

        List<UUID> categoryIds = categories.stream().map(CategoryDTO::getId).toList();

        LocalDateTime weeklyFrom = findFirstNonNullDate(categories, BudgetType.WEEK, true);
        LocalDateTime weeklyTo = findFirstNonNullDate(categories, BudgetType.WEEK, false);
        LocalDateTime monthlyFrom = findFirstNonNullDate(categories, BudgetType.MONTH, true);
        LocalDateTime monthlyTo = findFirstNonNullDate(categories, BudgetType.MONTH, false);
        LocalDateTime yearlyFrom = findFirstNonNullDate(categories, BudgetType.YEAR, true);
        LocalDateTime yearlyTo = findFirstNonNullDate(categories, BudgetType.YEAR, false);

        Map<UUID, BigDecimal> weeklySpentMap = getSpentAmountMap(categoryIds, weeklyFrom, weeklyTo);
        Map<UUID, BigDecimal> monthlySpentMap =
                getSpentAmountMap(categoryIds, monthlyFrom, monthlyTo);
        Map<UUID, BigDecimal> yearlySpentMap = getSpentAmountMap(categoryIds, yearlyFrom, yearlyTo);

        List<CategoryUiDTO> uiDtoList = mapperExtension.toCategoryListUiDTO(categories);

        uiDtoList.forEach(
                uiDto -> {
                    UUID categoryId = uiDto.getId();
                    if (uiDto.getWeeklyBudget() != null) {
                        uiDto.getWeeklyBudget()
                                .setSpentAmount(
                                        weeklySpentMap.getOrDefault(categoryId, BigDecimal.ZERO));
                    }
                    if (uiDto.getMonthlyBudget() != null) {
                        uiDto.getMonthlyBudget()
                                .setSpentAmount(
                                        monthlySpentMap.getOrDefault(categoryId, BigDecimal.ZERO));
                    }
                    if (uiDto.getYearlyBudget() != null) {
                        uiDto.getYearlyBudget()
                                .setSpentAmount(
                                        yearlySpentMap.getOrDefault(categoryId, BigDecimal.ZERO));
                    }
                });

        return uiDtoList;
    }

    @GetMapping("/combo")
    public List<CategoryUiDTO> getAllCategoriesForCombo() {
        return mapperExtension.toCategoryListUiDTO(budgetServiceClient.getAllCategories());
    }

    @GetMapping("/{id}")
    public CategoryDTO getCategoryById(@PathVariable UUID id) {
        return budgetServiceClient.getById(id);
    }

    private Map<UUID, BigDecimal> getSpentAmountMap(
            List<UUID> categoryIds, LocalDateTime from, LocalDateTime to) {
        if (from == null || to == null) {
            return Map.of();
        }
        GetTotalExpensesAmountRequestDTO request = new GetTotalExpensesAmountRequestDTO();
        request.setCategoryIds(categoryIds);
        request.setDateFrom(from);
        request.setDateTo(to);
        Map<UUID, BigDecimal> responseMap = expenseServiceClient.getTotalExpensesAmount(request);

        if (responseMap == null || responseMap.isEmpty()) {
            return Map.of();
        }
        return responseMap;
    }

    private LocalDateTime findFirstNonNullDate(
            List<CategoryDTO> categories, BudgetType type, boolean getStartDate) {
        return categories.stream()
                .map(
                        cat -> {
                            switch (type) {
                                case WEEK:
                                    return cat.getWeeklyBudget();
                                case MONTH:
                                    return cat.getMonthlyBudget();
                                case YEAR:
                                    return cat.getYearlyBudget();
                                default:
                                    return null;
                            }
                        })
                .filter(Objects::nonNull)
                .map(budget -> getStartDate ? budget.getPeriodStart() : budget.getPeriodEnd())
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }
}
