package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, UUID>, ExpenseRepositoryCustom {
}
