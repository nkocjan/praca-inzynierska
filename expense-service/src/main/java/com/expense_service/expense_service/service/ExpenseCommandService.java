package com.expense_service.expense_service.service;

import com.expense_service.expense_service.dto.CreateExpenseRequestDTO;
import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.UpdateExpenseRequestDTO;
import com.expense_service.expense_service.entity.ExpenseEntity;
import com.expense_service.expense_service.mappers.ExpenseMapper;
import com.expense_service.expense_service.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseCommandService {
    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseDTO createExpense(CreateExpenseRequestDTO request) {
        ExpenseEntity expense = expenseRepository.save(expenseMapper.fromCreateRequest(request));
        return expenseMapper.toDto(expense);
    }

    public ExpenseDTO setAsPlanned(UUID expenseId, boolean isPlanned) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
        expense.setIsPlanned(isPlanned);
        expenseRepository.save(expense);
        return expenseMapper.toDto(expense);
    }

    public ExpenseDTO updateExpense(UUID expenseId, UpdateExpenseRequestDTO request) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
        expense.setName(request.getName());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        ExpenseEntity updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toDto(updatedExpense);
    }

    public void deleteExpense(UUID expenseId) {
        if (!expenseRepository.existsById(expenseId)) {
            throw new RuntimeException("Expense not found: " + expenseId);
        }
        expenseRepository.deleteById(expenseId);
    }
}
