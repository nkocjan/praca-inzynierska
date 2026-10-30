package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.dto.ResetCategoriesRequestDTO;
import com.budget_service.budget_service.dto.UpdateCategoryDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.entity.UserRepEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.mappers.CategoryMapper;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import com.budget_service.budget_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.EnumMap;
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
    private final BudgetConfigHistoryRepository budgetConfigHistoryRepository;

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
        CategoryEntity entity = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + categoryId));
        entity.setName(request.getName());
        categoryRepository.save(entity);
        Map<BudgetType, BigDecimal> newAmounts = new EnumMap<>(BudgetType.class);
        newAmounts.put(BudgetType.WEEK, request.getWeekBudget());
        newAmounts.put(BudgetType.MONTH, request.getMonthBudget());
        newAmounts.put(BudgetType.YEAR, request.getYearBudget());

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

        // The config is the default for the periods to come; without it the old limit came back next month.
        newAmounts.forEach((type, amount) -> {
            if (amount != null) {
                budgetConfigCommandService.createOrUpdateConfig(categoryId, type, amount);
            }
        });
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        if(!categoryRepository.existsByIdAndUserId(id, userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id);
        }

        budgetRepository.deleteByCategory_Id(id);
        budgetConfigHistoryRepository.deleteByCategory_Id(id);
        categoryRepository.deleteById(id);
    }

    // Everything the user has here, for account deletion. Safe to repeat when an earlier attempt stopped halfway.
    @Transactional
    public void deleteAllForUser(UUID userId) {
        budgetRepository.deleteByCategory_User_Id(userId);
        budgetConfigHistoryRepository.deleteByCategory_User_Id(userId);
        categoryRepository.deleteByUser_Id(userId);
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

    @Transactional
    public void resetSelectedCategories(UUID userId, ResetCategoriesRequestDTO request) {
        if (request == null || request.getCategoryIds() == null || request.getCategoryIds().isEmpty()) {
            return;
        }

        budgetCommandService.resetSelectedCategories(userId, request.getCategoryIds());
    }
}
