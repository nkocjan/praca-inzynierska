package com.bff.bff.controller;

import com.bff.bff.client.BudgetServiceClient;
import com.bff.bff.dto.ui.CategoryCreateRequestUiDTO;
import com.bff.bff.dto.ui.CategoryUiDTO;
import com.bff.bff.dto.ui.UpdateCategoryUiDTO;
import com.bff.bff.mapper.MapperExtension;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff/categories")
@RequiredArgsConstructor
public class CategoryCommandController {
    private final BudgetServiceClient budgetServiceClient;
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
    public void deleteCategory(@PathVariable UUID id) {
        budgetServiceClient.deleteCategory(id);
    }

    @PutMapping("/{categoryId}")
    public void updateCategory(
            @PathVariable UUID categoryId, @RequestBody UpdateCategoryUiDTO request) {
        budgetServiceClient.updateCategory(
                categoryId, mapperExtension.toUpdateBudgetConfigForCategoryDTO(request));
    }
}
