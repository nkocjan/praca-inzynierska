package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.entity.ExpenseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExpenseRepositoryCustom {
    Page<ExpenseEntity> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable);
}
