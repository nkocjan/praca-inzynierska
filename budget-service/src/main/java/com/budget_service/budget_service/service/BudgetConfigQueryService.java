package com.budget_service.budget_service.service;

import com.budget_service.budget_service.entity.BudgetConfigHistoryEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetConfigQueryService {

    private final BudgetConfigHistoryRepository configRepository;

    @Transactional(readOnly = true)
    public BigDecimal getActiveAmount(UUID categoryId, BudgetType budgetType) {
        return configRepository.findFirstByCategoryIdAndBudgetTypeAndIsActiveTrue(categoryId, budgetType)
                .map(BudgetConfigHistoryEntity::getAmount)
                .orElse(BigDecimal.ZERO);
    }

    @Transactional(readOnly = true)
    public Map<BudgetType, BigDecimal> getActiveConfigMap(UUID categoryId) {
        return configRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
                .collect(Collectors.toMap(
                        BudgetConfigHistoryEntity::getBudgetType,
                        BudgetConfigHistoryEntity::getAmount,
                        (existing, replacement) -> existing
                ));
    }
}