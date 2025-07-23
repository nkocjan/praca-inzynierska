package com.expense_service.expense_service.service;

import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.mappers.ExpenseMapper;
import com.expense_service.expense_service.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseQueryService {
   private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public Page<ExpenseDTO> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable) {
        return expenseRepository.searchExpenses(request, pageable).map(expenseMapper::toDto);
    }

    public ExpenseDTO getExpenseById(UUID expenseId) {
        return expenseRepository.findById(expenseId)
                .map(expenseMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
    }
}
