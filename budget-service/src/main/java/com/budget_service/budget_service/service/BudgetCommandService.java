package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.BudgetCreateRequestDTO;
import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.dto.SetDefaultBudgetsRequestDTO;
import com.budget_service.budget_service.entity.BudgetConfigHistoryEntity;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.enums.DateRange;
import com.budget_service.budget_service.mappers.BudgetMapper;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map; 
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetCommandService {
    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;
    private final CategoryRepository categoryRepository;
    private final BudgetConfigQueryService budgetConfigQueryService;
    private final BudgetConfigHistoryRepository budgetConfigHistoryRepository;

    public BudgetDTO create(BudgetCreateRequestDTO dto) {
        CategoryEntity category = categoryRepository.getReferenceById(dto.getCategoryId());

        BudgetEntity entity = budgetMapper.toEntity(dto);
        entity.setCategory(category);
        return budgetMapper.toDto(budgetRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found: " + id);
        }

        budgetRepository.deleteById(id);
    }


    @Transactional
    public void createInitialBudgetsForCategory(CategoryEntity category, Map<BudgetType, BigDecimal> defaultAmounts) {
        LocalDate today = LocalDate.now();

        DateRange weekRange = calculateDateRange(BudgetType.WEEK, today);
        BudgetEntity weeklyBudget = buildBudget(
                category,
                BudgetType.WEEK,
                defaultAmounts.getOrDefault(BudgetType.WEEK, BigDecimal.ZERO),
                weekRange.start(),
                weekRange.end()
        );

        DateRange monthRange = calculateDateRange(BudgetType.MONTH, today);
        BudgetEntity monthlyBudget = buildBudget(
                category,
                BudgetType.MONTH,
                defaultAmounts.getOrDefault(BudgetType.MONTH, BigDecimal.ZERO),
                monthRange.start(),
                monthRange.end()
        );

        DateRange yearRange = calculateDateRange(BudgetType.YEAR, today);
        BudgetEntity yearlyBudget = buildBudget(
                category,
                BudgetType.YEAR,
                defaultAmounts.getOrDefault(BudgetType.YEAR, BigDecimal.ZERO),
                yearRange.start(),
                yearRange.end()
        );

        budgetRepository.saveAll(List.of(weeklyBudget, monthlyBudget, yearlyBudget));
    }

    @Transactional
    public BudgetEntity createAndSaveBudgetForPeriod(CategoryEntity category, BudgetType type, LocalDate forDate) {
        BigDecimal amount = budgetConfigQueryService.getActiveAmount(category.getId(), type);

        DateRange range = calculateDateRange(type, forDate);

        BudgetEntity entity = buildBudget(
                category,
                type,
                amount,
                range.start(),
                range.end()
        );

        return budgetRepository.save(entity);
    }

    @Transactional
    public void  setDefaultBudgets(SetDefaultBudgetsRequestDTO requestDTO, UUID userId){
        CategoryEntity category = categoryRepository.findByIdAndUserId(requestDTO.getCategoryId(), userId)
                .orElseThrow(() -> new RuntimeException("Category not found or not owned by user: " + requestDTO.getCategoryId()));

        List<BudgetConfigHistoryEntity> oldConfigs = budgetConfigHistoryRepository
                .findByCategory_IdAndIsActiveTrue(category.getId());

        oldConfigs.forEach(config -> config.setIsActive(false));
        budgetConfigHistoryRepository.saveAll(oldConfigs);

        List<BudgetConfigHistoryEntity> newConfigs = new ArrayList<>();
        if (requestDTO.getWeeklyAmount() != null) {
            newConfigs.add(buildConfigHistory(category, BudgetType.WEEK, requestDTO.getWeeklyAmount()));
        }
        if (requestDTO.getMonthlyAmount() != null) {
            newConfigs.add(buildConfigHistory(category, BudgetType.MONTH, requestDTO.getMonthlyAmount()));
        }
        if (requestDTO.getYearlyAmount() != null) {
            newConfigs.add(buildConfigHistory(category, BudgetType.YEAR, requestDTO.getYearlyAmount()));
        }

        budgetConfigHistoryRepository.saveAll(newConfigs);
    }

    @Transactional
    public void resetData(UUID userId) {
        budgetRepository.deleteByCategory_User_Id(userId);

        List<CategoryEntity> categories = categoryRepository.findAllByUserIdWithBudgets(userId);
        recreateCurrentBudgets(categories);
    }

    @Transactional
    public void resetSelectedCategories(UUID userId, Collection<UUID> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return;
        }

        budgetRepository.deleteByCategory_IdInAndCategory_User_Id(categoryIds, userId);

        List<CategoryEntity> categories = categoryRepository.findAllByIdInAndUserIdWithBudgets(List.copyOf(categoryIds), userId);
        recreateCurrentBudgets(categories);
    }

    private void recreateCurrentBudgets(List<CategoryEntity> categories) {
        if (categories == null || categories.isEmpty()) {
            return;
        }

        LocalDate today = LocalDate.now();
        for (CategoryEntity category : categories) {
            createAndSaveBudgetForPeriod(category, BudgetType.WEEK, today);
            createAndSaveBudgetForPeriod(category, BudgetType.MONTH, today);
            createAndSaveBudgetForPeriod(category, BudgetType.YEAR, today);
        }
    }

    private BudgetEntity buildBudget(CategoryEntity category, BudgetType type, BigDecimal amount, LocalDateTime start, LocalDateTime end) {
        return BudgetEntity.builder()
                .category(category)
                .period(type)
                .amount(amount)
                .periodStart(start)
                .periodEnd(end)
                .build();
    }

    private BudgetConfigHistoryEntity buildConfigHistory(CategoryEntity category, BudgetType type, BigDecimal amount) {
        return BudgetConfigHistoryEntity.builder()
                .category(category)
                .budgetType(type)
                .amount(amount)
                .isActive(true)
                .build();
    }

    public DateRange calculateDateRange(BudgetType type, LocalDate forDate) {
        LocalDateTime start, end;

        switch (type) {
            case WEEK:
                LocalDate startOfWeek = forDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                LocalDate endOfWeek = forDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
                start = startOfWeek.atTime(0, 1, 0);
                end = endOfWeek.atTime(LocalTime.MAX);
                break;

            case MONTH:
                LocalDate startOfMonth = forDate.with(TemporalAdjusters.firstDayOfMonth());
                LocalDate endOfMonth = forDate.with(TemporalAdjusters.lastDayOfMonth());
                start = startOfMonth.atStartOfDay();
                end = endOfMonth.atTime(LocalTime.MAX);
                break;

            case YEAR:
                LocalDate startOfYear = forDate.with(TemporalAdjusters.firstDayOfYear());
                LocalDate endOfYear = forDate.with(TemporalAdjusters.lastDayOfYear());
                start = startOfYear.atStartOfDay();
                end = endOfYear.atTime(LocalTime.MAX);
                break;

            default:
                throw new IllegalArgumentException("Unsupported BudgetType: " + type);
        }
        return new DateRange(start, end);
    }
}