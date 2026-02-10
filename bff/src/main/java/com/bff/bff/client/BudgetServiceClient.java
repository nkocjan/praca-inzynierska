package com.bff.bff.client;

import com.bff.bff.dto.api.*;
import java.util.List;
import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "budget-service", url = "${budget-service.url}")
public interface BudgetServiceClient {
    @PostMapping("/api/v1/budgets")
    BudgetDTO createBudget(@RequestBody BudgetCreateRequestDTO dto);

    @DeleteMapping("/api/v1/budgets/{id}")
    void deleteBudget(@PathVariable("id") UUID id);

    @PostMapping("/api/v1/categories")
    CategoryDTO createCategory(@RequestBody CategoryCreateRequestDTO dto);

    @DeleteMapping("/api/v1/categories/{id}")
    void deleteCategory(@PathVariable("id") UUID id);

    @PostMapping("/api/v1/categories/init-user/{id}")
    void initUserCategories(@PathVariable("id") UUID id);

    @GetMapping("/api/v1/categories")
    List<CategoryDTO> getAllCategories();

    @GetMapping("/api/v1/categories/{id}")
    CategoryDTO getById(@PathVariable("id") UUID id);

    @GetMapping("/api/v1/budgets")
    List<BudgetDTO> getAllBudgets();

    @GetMapping("/api/v1/budgets/{id}")
    BudgetDTO getBudgetById(@PathVariable("id") UUID id);

    @PostMapping("/api/v1/budgets/search")
    Page<BudgetDTO> searchBudgets(@RequestBody BudgetSearchRequestDTO request, Pageable pageable);

    @PutMapping("/api/v1/categories/{categoryId}")
    void updateCategory(
            @PathVariable("categoryId") UUID categoryId, @RequestBody UpdateCategoryDTO request);

    @PostMapping("/api/v1/budgets/set-default")
    void setDefaultBudgets(@RequestBody SetDefaultBudgetsRequestDTO request);

    @GetMapping("/api/v1/budgets/get-default/{categoryId}")
    GetDefaultBudgetsResponseDTO getDefaultBudgets(@PathVariable("categoryId") UUID categoryId);

    @DeleteMapping("/api/v1/budgets/user/{userId}/data")
    void resetData(@PathVariable("userId") UUID userId);

    @PostMapping("/api/v1/categories/user/{userId}/reset")
    void resetSelectedCategories(@PathVariable("userId") UUID userId, @RequestBody ResetCategoriesRequestDTO request);
}
