package com.budget_service.budget_service.mappers;

import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.service.BudgetCommandService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {BudgetMapper.class})
public abstract class CategoryMapper {

    @Autowired
    protected BudgetMapper budgetMapper;

    @Autowired
    protected BudgetCommandService budgetCommandService;

    @Mapping(target = "weeklyBudget", ignore = true)
    @Mapping(target = "monthlyBudget", ignore = true)
    @Mapping(target = "yearlyBudget", ignore = true)
    public abstract CategoryDTO toDto(CategoryEntity entity);

    @Mapping(target = "isActive", constant = "true")
    public abstract CategoryEntity toEntity(CategoryCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    public abstract void updateEntityFromDto(CategoryCreateRequestDTO dto, @MappingTarget CategoryEntity entity);

    public abstract CategoryEntity fromCreateRequest(CategoryCreateRequestDTO request);

    @AfterMapping
    protected void mapActiveBudgets(@MappingTarget CategoryDTO dto, CategoryEntity entity) {
        List<BudgetEntity> budgets = entity.getBudgets();
        if (budgets == null) {
            return;
        }

        LocalDate today = LocalDate.now();

        BudgetEntity weeklyBudget = findActiveBudget(budgets, BudgetType.WEEK, today)
                .orElseGet(() -> createMissingBudget(entity, BudgetType.WEEK, today));
        dto.setWeeklyBudget(budgetMapper.toDto(weeklyBudget));

        BudgetEntity monthlyBudget = findActiveBudget(budgets, BudgetType.MONTH, today)
                .orElseGet(() -> createMissingBudget(entity, BudgetType.MONTH, today));
        dto.setMonthlyBudget(budgetMapper.toDto(monthlyBudget));

        BudgetEntity yearlyBudget = findActiveBudget(budgets, BudgetType.YEAR, today)
                .orElseGet(() -> createMissingBudget(entity, BudgetType.YEAR, today));
        dto.setYearlyBudget(budgetMapper.toDto(yearlyBudget));
    }

    private BudgetEntity createMissingBudget(CategoryEntity category, BudgetType type, LocalDate today) {
        BudgetEntity newBudget = budgetCommandService.createAndSaveBudgetForPeriod(category, type, today);

        category.getBudgets().add(newBudget);

        return newBudget;
    }

    private Optional<BudgetEntity> findActiveBudget(List<BudgetEntity> budgets, BudgetType type, LocalDate today) {
        return budgets.stream()
                .filter(b -> b.getPeriod() == type)
                .filter(b -> isDateActive(b.getPeriodStart(), b.getPeriodEnd(), today))
                .findFirst();
    }

    private boolean isDateActive(LocalDateTime start, LocalDateTime end, LocalDate today) {
        if (start == null || end == null) {
            return false;
        }
        LocalDate startDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        return !today.isBefore(startDate) && !today.isAfter(endDate);
    }
}