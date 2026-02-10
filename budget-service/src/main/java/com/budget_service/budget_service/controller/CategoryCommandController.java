package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.dto.ResetCategoriesRequestDTO;
import com.budget_service.budget_service.dto.UpdateCategoryDTO;
import com.budget_service.budget_service.service.CategoryCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryCommandController {
    private final CategoryCommandService categoryCommandService;

    private static void assertSameUser(UUID headerUserId, UUID pathUserId) {
        if (headerUserId == null || pathUserId == null || !headerUserId.equals(pathUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    @PostMapping
    public CategoryDTO create(@RequestBody CategoryCreateRequestDTO dto, @RequestHeader("X-User-Id") UUID userId) {
        return categoryCommandService.createCategory(dto, userId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID userId) {
        categoryCommandService.delete(id, userId);
    }

    @PostMapping("/init-user/{id}")
    public void initDefaultCategories(@PathVariable UUID id) {
        categoryCommandService.initDefaultCategoriesForUser(id);
    }

    @PutMapping("/{categoryId}")
    public void updateCategory(@PathVariable UUID categoryId, @RequestBody UpdateCategoryDTO request, @RequestHeader("X-User-Id") UUID userId) {
        categoryCommandService.updateCategory(categoryId, request, userId);
    }

    @PostMapping("/user/{userId}/reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetSelectedCategories(
            @PathVariable UUID userId,
            @RequestBody ResetCategoriesRequestDTO request,
            @RequestHeader("X-User-Id") UUID headerUserId) {
        assertSameUser(headerUserId, userId);
        categoryCommandService.resetSelectedCategories(userId, request);
    }
}
