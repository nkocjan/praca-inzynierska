package com.budget_service.budget_service.service;

import com.budget_service.budget_service.entity.BudgetConfigHistoryEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetConfigCommandService {

    private final BudgetConfigHistoryRepository configRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public void createOrUpdateConfig(UUID categoryId, BudgetType budgetType, BigDecimal amount) {
        configRepository.findFirstByCategoryIdAndBudgetTypeAndIsActiveTrueOrderByCreatedAtDesc(categoryId, budgetType)
                .ifPresent(oldConfig -> {
                    oldConfig.setIsActive(false);
                    configRepository.save(oldConfig);
                });

        CategoryEntity category = categoryRepository.getReferenceById(categoryId);

        BudgetConfigHistoryEntity newConfig = BudgetConfigHistoryEntity.builder()
                .category(category)
                .budgetType(budgetType)
                .amount(amount)
                .isActive(true)
                .build();

        configRepository.save(newConfig);
    }
}