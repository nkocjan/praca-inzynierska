package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryQueryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public List<CategoryDTO> findAllByUser(UUID userId) {
        return categoryRepository.findAllByUserIdWithBudgets(userId).stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Transactional
    public List<CategoryDTO> findByIdsAndUser(List<UUID> ids, UUID userId) {
        return categoryRepository.findAllByIdInAndUserIdWithBudgets(ids, userId).stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Transactional
    public CategoryDTO getById(UUID id, UUID userId) {
        return categoryRepository.findByIdAndUserIdWithBudgets(id, userId)
                .map(categoryMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Category not found or not owned by user"));
    }
}