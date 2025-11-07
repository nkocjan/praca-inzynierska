package com.bff.bff.dto.api;

import java.util.List;
import lombok.Data;

@Data
public class DashboardDataResponseDTO {
    private List<ExpenseDTO> expenses;

    private PieChartDataDTO weeklyPieChart;
    private PieChartDataDTO monthlyPieChart;
    private PieChartDataDTO yearlyPieChart;

    private List<CategoryRepDTO> categories;
    private List<BarChartDataPairDTO> barChartData;
}
