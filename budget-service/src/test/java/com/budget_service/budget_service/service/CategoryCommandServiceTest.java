package com.budget_service.budget_service.service;

import static org.mockito.Mockito.inOrder;

import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import com.budget_service.budget_service.repository.UserRepRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryCommandServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryMapper categoryMapper;
    @Mock private UserRepRepository userRepRepository;
    @Mock private BudgetCommandService budgetCommandService;
    @Mock private BudgetConfigCommandService budgetConfigCommandService;
    @Mock private BudgetRepository budgetRepository;
    @Mock private BudgetConfigHistoryRepository budgetConfigHistoryRepository;

    @InjectMocks private CategoryCommandService service;

    @Test
    void deleteAllForUserRemovesBudgetsAndHistoryBeforeTheCategories() {
        var userId = UUID.randomUUID();

        service.deleteAllForUser(userId);

        // budgets and budget_configs_history have foreign keys to categories
        var order = inOrder(budgetRepository, budgetConfigHistoryRepository, categoryRepository);
        order.verify(budgetRepository).deleteByCategory_User_Id(userId);
        order.verify(budgetConfigHistoryRepository).deleteByCategory_User_Id(userId);
        order.verify(categoryRepository).deleteByUser_Id(userId);
    }
}
