package com.expense_service.expense_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardDataResponseDTO {
    private List<ExpenseDTO> expenses;

    private PieChartDataDTO weeklyPieChart;
    private PieChartDataDTO monthlyPieChart;
    private PieChartDataDTO yearlyPieChart;

    private List<CategoryRepDTO> categories;
    private List<BarChartDataPairDTO> barChartData;
}

