package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.entity.BudgetConfigHistoryEntity;
import com.budget_service.budget_service.enums.BudgetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetConfigHistoryRepository extends JpaRepository<BudgetConfigHistoryEntity, UUID> {

    Optional<BudgetConfigHistoryEntity> findFirstByCategoryIdAndBudgetTypeAndIsActiveTrue(
            UUID categoryId, BudgetType budgetType
    );

    List<BudgetConfigHistoryEntity> findByCategoryIdAndIsActiveTrue(UUID categoryId);

    Optional<BudgetConfigHistoryEntity> findFirstByCategoryIdAndBudgetTypeAndIsActiveTrueOrderByCreatedAtDesc(
            UUID categoryId, BudgetType budgetType
    );

    List<BudgetConfigHistoryEntity> findByCategory_IdAndCategory_User_IdAndIsActiveTrue(UUID categoryId, UUID userId);

    List<BudgetConfigHistoryEntity> findByCategory_IdAndIsActiveTrue(UUID categoryId);
}