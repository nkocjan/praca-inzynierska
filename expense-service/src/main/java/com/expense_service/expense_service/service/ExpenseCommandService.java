package com.expense_service.expense_service.service;

import com.expense_service.expense_service.dto.CreateExpenseRequestDTO;
import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.dto.ResetCategoriesRequestDTO;
import com.expense_service.expense_service.dto.UpdateExpenseRequestDTO;
import com.expense_service.expense_service.entity.CategoryRepEntity;
import com.expense_service.expense_service.entity.ExpenseEntity;
import com.expense_service.expense_service.entity.UserRepEntity;
import com.expense_service.expense_service.mappers.ExpenseMapper;
import com.expense_service.expense_service.repository.CategoryRepRepository;
import com.expense_service.expense_service.repository.ExpenseRepository;
import com.expense_service.expense_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseCommandService {
    private final ExpenseRepository expenseRepository;
    private final UserRepRepository userRepRepository;
    private final CategoryRepRepository categoryRepRepository;
    private final ExpenseMapper expenseMapper;

    @Transactional
    public ExpenseDTO createExpense(CreateExpenseRequestDTO request, UUID userId) {
        ExpenseEntity expense = expenseMapper.fromCreateRequest(request);

        UserRepEntity userReference = userRepRepository.getReferenceById(userId);
        CategoryRepEntity categoryReference = categoryRepRepository.getReferenceById(request.getCategoryId()); 

        expense.setUser(userReference);
        expense.setCategory(categoryReference);

        ExpenseEntity savedExpense = expenseRepository.save(expense);

        return expenseMapper.toDto(savedExpense);
    }

    @Transactional
    public ExpenseDTO setAsPlanned(UUID expenseId, boolean isPlanned, UUID userId) {
        ExpenseEntity expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
        expense.setIsPlanned(isPlanned);
        expenseRepository.save(expense);
        return expenseMapper.toDto(expense);
    }

    @Transactional
    public ExpenseDTO updateExpense(UUID expenseId, UpdateExpenseRequestDTO request, UUID userId) {
        ExpenseEntity expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
        expense.setName(request.getName());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        ExpenseEntity updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toDto(updatedExpense);
    }

    @Transactional
    public void deleteExpense(UUID expenseId, UUID userId) {
        if (!expenseRepository.existsByIdAndUserId(expenseId, userId)) {
            throw new RuntimeException("Expense not found: " + expenseId);
        }
        expenseRepository.deleteById(expenseId);
    }

    @Transactional
    public void resetData(UUID userId) {
        expenseRepository.deleteByUser_Id(userId);
    }

    @Transactional
    public void resetSelectedCategories(UUID userId, ResetCategoriesRequestDTO request) {
        List<UUID> categoryIds = request != null ? request.getCategoryIds() : null;
        if (categoryIds == null || categoryIds.isEmpty()) {
            return;
        }
        expenseRepository.deleteByUser_IdAndCategory_IdIn(userId, categoryIds);
    }
}
