package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.dto.UpdateCategoryDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.entity.UserRepEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import com.budget_service.budget_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryCommandService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserRepRepository userRepRepository;
    private final BudgetCommandService budgetCommandService;
    private final BudgetConfigCommandService budgetConfigCommandService;
    private final BudgetRepository budgetRepository;

    @Transactional
    public CategoryDTO createCategory(CategoryCreateRequestDTO requestDTO, UUID userId) {
        UserRepEntity user = userRepRepository.getReferenceById(userId);

        CategoryEntity entity = categoryMapper.toEntity(requestDTO);
        entity.setUser(user);
        CategoryDTO resultDto =  categoryMapper.toDto(categoryRepository.save(entity));

        budgetConfigCommandService.createOrUpdateConfig(resultDto.getId(), BudgetType.WEEK, requestDTO.getWeekBudget());
        budgetConfigCommandService.createOrUpdateConfig(resultDto.getId(), BudgetType.MONTH, requestDTO.getMonthBudget());
        budgetConfigCommandService.createOrUpdateConfig(resultDto.getId(), BudgetType.YEAR, requestDTO.getYearBudget());

        return resultDto;
    }

    @Transactional
    public void updateCategory(UUID categoryId, UpdateCategoryDTO request, UUID userId) {
        CategoryEntity entity = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        entity.setName(request.getName());
        categoryRepository.save(entity);
        Map<BudgetType, BigDecimal> newAmounts = Map.of(
                BudgetType.WEEK, request.getWeekBudget(),
                BudgetType.MONTH, request.getMonthBudget(),
                BudgetType.YEAR, request.getYearBudget()
        );

        LocalDateTime now = LocalDateTime.now();
        List<BudgetEntity> activeBudgets = budgetRepository
                .findAllByCategoryIdAndPeriodStartLessThanEqualAndPeriodEndGreaterThanEqual(categoryId, now, now);

        for (BudgetEntity budget : activeBudgets) {
            BigDecimal newAmount = newAmounts.get(budget.getPeriod());
            if (newAmount != null) {
                budget.setAmount(newAmount);
            }
        }

        budgetRepository.saveAll(activeBudgets);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        if(!categoryRepository.existsByIdAndUserId(id, userId)) {
            throw new RuntimeException("Expense not found: " + id);
        }

        categoryRepository.deleteById(id);
    }

    @Transactional
    public void initDefaultCategoriesForUser(UUID userId) {
        UserRepEntity user = userRepRepository.getReferenceById(userId);

        List<CategoryEntity> defaultCategories = List.of(
                CategoryEntity.builder()
                        .name("Food")
                        .description("Expenses for food and groceries")
                        .isActive(true)
                        .user(user)
                        .build(),
                CategoryEntity.builder()
                        .name("Transport")
                        .description("Expenses for transportation")
                        .isActive(true)
                        .user(user)
                        .build(),
                CategoryEntity.builder()
                        .name("Entertainment")
                        .description("Expenses for entertainment and leisure")
                        .isActive(true)
                        .user(user)
                        .build(),
                CategoryEntity.builder()
                        .name("Utilities")
                        .description("Expenses for utilities and bills")
                        .isActive(true)
                        .user(user)
                        .build(),
                CategoryEntity.builder()
                        .name("Health")
                        .description("Expenses for health and medical needs")
                        .isActive(true)
                        .user(user)
                        .build()
        );

        List<CategoryEntity> savedCategories = categoryRepository.saveAll(defaultCategories);

        final BigDecimal defaultWeek = new BigDecimal("100.00");
        final BigDecimal defaultMonth = new BigDecimal("500.00");
        final BigDecimal defaultYear = new BigDecimal("7000.00");

        final Map<BudgetType, BigDecimal> defaultsMap = Map.of(
                BudgetType.WEEK, defaultWeek,
                BudgetType.MONTH, defaultMonth,
                BudgetType.YEAR, defaultYear
        );

        for (CategoryEntity category : savedCategories) {
            budgetConfigCommandService.createOrUpdateConfig(category.getId(), BudgetType.WEEK, defaultWeek);
            budgetConfigCommandService.createOrUpdateConfig(category.getId(), BudgetType.MONTH, defaultMonth);
            budgetConfigCommandService.createOrUpdateConfig(category.getId(), BudgetType.YEAR, defaultYear);

            budgetCommandService.createInitialBudgetsForCategory(category, defaultsMap);
        }
    }
}
