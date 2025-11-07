package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<BudgetEntity, UUID>, JpaSpecificationExecutor<BudgetEntity> {
    List<BudgetEntity> findAllByCategoryIdAndPeriodStartLessThanEqualAndPeriodEndGreaterThanEqual(UUID categoryId, LocalDateTime start, LocalDateTime end);
}
