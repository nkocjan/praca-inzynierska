package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.dto.GetTotalExpensesAmountRequestDTO;
import com.expense_service.expense_service.entity.CategoryRepEntity;
import com.expense_service.expense_service.entity.ExpenseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ExpenseRepositoryCustom {
    Page<ExpenseEntity> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable);

    Map<CategoryRepEntity, BigDecimal> getTotalExpensesAmount(GetTotalExpensesAmountRequestDTO request, UUID userId);

    List<ExpenseEntity> findRecentExpenses(UUID userId);

    Map<CategoryRepEntity, BigDecimal> getGroupedExpenses(UUID userId, LocalDateTime startTime, LocalDateTime endTime);

    List<Object[]> getMonthlyExpensesGroupedByCategory(UUID userId, LocalDateTime startTime);

    List<CategoryRepEntity> findDistinctActiveCategoriesByUserId(UUID userId);
}
