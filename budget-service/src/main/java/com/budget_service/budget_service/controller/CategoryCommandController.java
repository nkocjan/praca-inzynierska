package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.service.CategoryCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryCommandController {
    private final CategoryCommandService categoryCommandService;

    @PostMapping
    public CategoryDTO create(@RequestBody CategoryCreateRequestDTO dto) {
        return categoryCommandService.createCategory(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, @RequestParam UUID userId) {
        categoryCommandService.delete(id, userId);
    }
}
