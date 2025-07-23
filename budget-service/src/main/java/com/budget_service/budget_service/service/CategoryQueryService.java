package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryQueryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryDTO> findAllByUser(UUID userId) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .map(categoryMapper::toDto)
                .toList();
    }

    public List<CategoryDTO> findByIdsAndUser(List<UUID> ids, UUID userId) {
        return categoryRepository.findAllById(ids).stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .map(categoryMapper::toDto)
                .toList();
    }

    public CategoryDTO getById(UUID id, UUID userId) {
        return categoryRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(userId))
                .map(categoryMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Category not found or not owned by user"));
    }
}
