package com.bff.bff.dto.ui;

import com.bff.bff.dto.api.CategoryRepDTO;
import com.bff.bff.dto.api.CategorySimplifiedDTO;
import java.util.List;
import lombok.Data;

@Data
public class DashboardDataResponseUiDTO {
    private List<ExpenseUiDTO> expenses;

    private PieChartDataUiDTO weeklyPieChart;
    private PieChartDataUiDTO monthlyPieChart;
    private PieChartDataUiDTO yearlyPieChart;

    private List<CategoryRepDTO> categories;
    private List<BarChartDataPairUiDTO> barChartData;
}
