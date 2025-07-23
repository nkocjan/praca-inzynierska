package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.entity.UserRepEntity;
import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.CategoryRepository;
import com.budget_service.budget_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryCommandService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserRepRepository userRepRepository;

    public CategoryDTO createCategory(CategoryCreateRequestDTO categoryDTO) {
        UserRepEntity user = userRepRepository.findById(categoryDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        CategoryEntity entity = categoryMapper.toEntity(categoryDTO);
        entity.setUser(user);
        return categoryMapper.toDto(categoryRepository.save(entity));
    }

    public void delete(UUID id, UUID userId) {
        Optional<CategoryEntity> entity = categoryRepository.findById(id);
        entity.filter(c -> c.getUser().getId().equals(userId))
                .ifPresent(categoryRepository::delete);
    }
}
