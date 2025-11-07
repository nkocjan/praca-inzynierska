package com.bff.bff.dto.ui;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class PieChartDataUiDTO {
    private List<String> labels;
    private List<BigDecimal> data;
}
