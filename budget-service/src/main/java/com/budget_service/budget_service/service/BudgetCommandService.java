package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.BudgetCreateRequestDTO;
import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.entity.UserRepEntity;
import com.budget_service.budget_service.mappers.BudgetMapper;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import com.budget_service.budget_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetCommandService {
    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;
    private final UserRepRepository userRepRepository;
    private final CategoryRepository categoryRepository;

    public BudgetDTO create(BudgetCreateRequestDTO dto) {
        UserRepEntity user = userRepRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Category not found or not owned by user"));
        BudgetEntity entity = budgetMapper.toEntity(dto);
        entity.setCategory(category);
        return budgetMapper.toDto(budgetRepository.save(entity));
    }

    public void delete(UUID id, UUID userId) {
        Optional<BudgetEntity> entity = budgetRepository.findById(id);
        entity.filter(b -> b.getCategory().getUser().getId().equals(userId))
                .ifPresent(budgetRepository::delete);
    }

}
