package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.enums.BudgetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<BudgetEntity, UUID>, JpaSpecificationExecutor<BudgetEntity> {
    List<BudgetEntity> findAllByCategoryIdAndPeriodStartLessThanEqualAndPeriodEndGreaterThanEqual(UUID categoryId, LocalDateTime start, LocalDateTime end);

    Optional<BudgetEntity> findFirstByCategory_IdAndPeriodAndPeriodStart(UUID categoryId, BudgetType period, LocalDateTime periodStart);

    Optional<BudgetEntity> findByIdAndCategory_User_Id(UUID id, UUID userId);

    void deleteByCategory_User_Id(UUID userId);

    void deleteByCategory_Id(UUID categoryId);

    boolean existsByIdAndCategory_User_Id(UUID id, UUID userId);

    void deleteByCategory_IdInAndCategory_User_Id(Collection<UUID> categoryIds, UUID userId);
}
