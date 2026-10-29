package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.client.ExpenseServiceClient;
import com.bff.bff.dto.api.ResetCategoriesRequestDTO;
import com.bff.bff.dto.ui.CategoryCreateRequestUiDTO;
import com.bff.bff.dto.ui.CategoryUiDTO;
import com.bff.bff.dto.ui.UpdateCategoryUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/categories")
@RequiredArgsConstructor
public class CategoryCommandController {
    private final BudgetServiceClient budgetServiceClient;
    private final ExpenseServiceClient expenseServiceClient;
    private final MapperExtension mapperExtension;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryUiDTO createCategory(@RequestBody CategoryCreateRequestUiDTO request) {
        var requestDto = mapperExtension.toCategoryCreateRequestDTO(request);
        var resultDto = budgetServiceClient.createCategory(requestDto);
        return mapperExtension.toCategoryUiDTO(resultDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@AuthenticationPrincipal UUID userId, @PathVariable UUID id) {
        // Expense deletion is scoped to the caller; budget-service checks category ownership.
        var request = new ResetCategoriesRequestDTO();
        request.setCategoryIds(List.of(id));
        expenseServiceClient.resetSelectedCategories(userId, request);
        budgetServiceClient.deleteCategory(id);
    }

    @PutMapping("/{categoryId}")
    public void updateCategory(
            @PathVariable UUID categoryId, @RequestBody UpdateCategoryUiDTO request) {
        budgetServiceClient.updateCategory(
                categoryId, mapperExtension.toUpdateBudgetConfigForCategoryDTO(request));
    }
}
