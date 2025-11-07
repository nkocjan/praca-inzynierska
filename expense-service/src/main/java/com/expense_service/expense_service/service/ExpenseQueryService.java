package com.expense_service.expense_service.service;

import com.expense_service.expense_service.dto.*;
import com.expense_service.expense_service.entity.BudgetRepEntity;
import com.expense_service.expense_service.entity.CategoryRepEntity;
import com.expense_service.expense_service.entity.ExpenseEntity;
import com.expense_service.expense_service.enums.BudgetType;
import com.expense_service.expense_service.mappers.ExpenseMapper;
import com.expense_service.expense_service.repository.BudgetRepRepository;
import com.expense_service.expense_service.repository.CategoryRepRepository;
import com.expense_service.expense_service.repository.ExpenseRepository;
import com.expense_service.expense_service.repository.ExpenseRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ExpenseQueryService {
   private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final BudgetRepRepository budgetRepRepository;

    @Transactional(readOnly = true)
    public Page<ExpenseDTO> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable, UUID userId) {
        return expenseRepository.searchExpenses(request, pageable).map(expenseMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseById(UUID expenseId, UUID userId) {
        return expenseRepository.findByIdAndUserId(expenseId, userId)
                .map(expenseMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId + " for user: " + userId));
    }

    @Transactional(readOnly = true)
    public Map<UUID, BigDecimal> getTotalExpensesAmount(GetTotalExpensesAmountRequestDTO request, UUID userId) {
        Map<CategoryRepEntity, BigDecimal> rawMap = expenseRepository.getTotalExpensesAmount(request, userId);

        return rawMap.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().getId(),
                        Map.Entry::getValue
                ));
    }

    @Transactional
    public DashboardDataResponseDTO getDashboardData(UUID userId) {
        DashboardDataResponseDTO response = new DashboardDataResponseDTO();
        LocalDateTime now = LocalDateTime.now();

        List<CategoryRepEntity> activeCategories = expenseRepository.findDistinctActiveCategoriesByUserId(userId);
        response.setCategories(activeCategories.stream()
                .map(expenseMapper::toCategoryDto)
                .toList());
        List<UUID> activeCategoryIds = activeCategories.stream().map(CategoryRepEntity::getId).toList();

        LocalDateTime startOfMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
        List<ExpenseEntity> recentExpenses = expenseRepository.findRecentExpenses(userId);
        response.setExpenses(expenseMapper.toDtoList(recentExpenses));

        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime startOfYear = now.toLocalDate().withDayOfYear(1).atStartOfDay();

        response.setWeeklyPieChart(createPieChartData(
                expenseRepository.getGroupedExpenses(userId, startOfWeek, now)
        ));
        response.setMonthlyPieChart(createPieChartData(
                expenseRepository.getGroupedExpenses(userId, startOfMonth, now)
        ));
        response.setYearlyPieChart(createPieChartData(
                expenseRepository.getGroupedExpenses(userId, startOfYear, now)
        ));

        response.setBarChartData(buildBarChartData(userId, activeCategories, activeCategoryIds));

        return response;
    }

    private PieChartDataDTO createPieChartData(Map<CategoryRepEntity, BigDecimal> data) {
        PieChartDataDTO pieChart = new PieChartDataDTO();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> values = new ArrayList<>();

        data.forEach((category, amount) -> {
            labels.add(category.getName());
            values.add(amount);
        });

        pieChart.setLabels(labels);
        pieChart.setData(values);
        return pieChart;
    }

    private List<BarChartDataPairDTO> buildBarChartData(UUID userId, List<CategoryRepEntity> activeCategories, List<UUID> activeCategoryIds) {

        final int BAR_CHART_MONTHS = 6;
        final var MONTH_YEAR_FORMATTER = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM");

        List<String> monthLabels = IntStream.range(0, BAR_CHART_MONTHS)
                .mapToObj(i -> YearMonth.now().minusMonths(i))
                .map(ym -> ym.format(MONTH_YEAR_FORMATTER))
                .sorted()
                .toList();

        Map<UUID, BigDecimal> monthlyBudgets = budgetRepRepository.findByCategoryIdInAndPeriod(activeCategoryIds, BudgetType.MONTH)
                .stream()
                .collect(Collectors.toMap(
                        BudgetRepEntity::getCategoryId,
                        BudgetRepEntity::getAmount,
                        (amt1, amt2) -> amt1
                ));

        LocalDateTime barChartStartDate = LocalDate.now().minusMonths(BAR_CHART_MONTHS - 1).withDayOfMonth(1).atStartOfDay();
        List<Object[]> expenseResults = expenseRepository.getMonthlyExpensesGroupedByCategory(userId, barChartStartDate);

        Map<UUID, Map<String, BigDecimal>> expensesMap = new HashMap<>();
        for (Object[] row : expenseResults) {
            UUID categoryId = (UUID) row[0];
            String monthYear = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            expensesMap.computeIfAbsent(categoryId, k -> new HashMap<>()).put(monthYear, amount);
        }

        List<BarChartDataPairDTO> barChartData = new ArrayList<>();
        for (CategoryRepEntity category : activeCategories) {
            UUID catId = category.getId();

            BarChartDataDTO chartData = new BarChartDataDTO();
            chartData.setLabels(monthLabels);

            BigDecimal budgetAmount = monthlyBudgets.getOrDefault(catId, BigDecimal.ZERO);
            Map<String, BigDecimal> categoryExpenses = expensesMap.getOrDefault(catId, Collections.emptyMap());

            chartData.setBudgetData(Collections.nCopies(monthLabels.size(), budgetAmount));

            List<BigDecimal> expensesData = monthLabels.stream()
                    .map(monthLabel -> categoryExpenses.getOrDefault(monthLabel, BigDecimal.ZERO))
                    .toList();
            chartData.setExpensesData(expensesData);

            BarChartDataPairDTO pair = new BarChartDataPairDTO();
            pair.setCategoryId(catId.toString());
            pair.setData(chartData);
            barChartData.add(pair);
        }

        return barChartData;
    }
}
