package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.entity.BudgetRepEntity;
import com.expense_service.expense_service.enums.BudgetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BudgetRepRepository extends JpaRepository<BudgetRepEntity, UUID> {

    List<BudgetRepEntity> findByCategoryIdInAndPeriod(List<UUID> categoryIds, BudgetType period);
}
