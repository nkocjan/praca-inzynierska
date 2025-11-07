package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {
    Optional<CategoryEntity> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT c FROM CategoryEntity c LEFT JOIN FETCH c.budgets WHERE c.user.id = :userId")
    List<CategoryEntity> findAllByUserIdWithBudgets(@Param("userId") UUID userId);

    @Query("SELECT c FROM CategoryEntity c LEFT JOIN FETCH c.budgets WHERE c.id IN :ids AND c.user.id = :userId")
    List<CategoryEntity> findAllByIdInAndUserIdWithBudgets(@Param("ids") List<UUID> ids, @Param("userId") UUID userId);

    @Query("SELECT c FROM CategoryEntity c LEFT JOIN FETCH c.budgets WHERE c.id = :id AND c.user.id = :userId")
    Optional<CategoryEntity> findByIdAndUserIdWithBudgets(@Param("id") UUID id, @Param("userId") UUID userId);
}
