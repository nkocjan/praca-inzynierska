package com.budget_service.budget_service.controller;

import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.service.CategoryQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryQueryController {
    private final CategoryQueryService categoryQueryService;

    @GetMapping
    public List<CategoryDTO> getAll(@RequestParam UUID userId) {
        return categoryQueryService.findAllByUser(userId);
    }

    @GetMapping("/by-ids")
    public List<CategoryDTO> getByIds(
            @RequestParam List<UUID> ids,
            @RequestParam UUID userId
    ) {
        return categoryQueryService.findByIdsAndUser(ids, userId);
    }

    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable UUID id, @RequestParam UUID userId) {
        return categoryQueryService.getById(id, userId);
    }
}
