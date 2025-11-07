package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, UUID>, ExpenseRepositoryCustom {
    Optional<ExpenseEntity> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByIdAndUserId(UUID id, UUID userId);
}
