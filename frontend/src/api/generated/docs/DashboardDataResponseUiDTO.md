# DashboardDataResponseUiDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expenses** | [**Array&lt;ExpenseUiDTO&gt;**](ExpenseUiDTO.md) |  | [optional] [default to undefined]
**weeklyPieChart** | [**PieChartDataUiDTO**](PieChartDataUiDTO.md) |  | [optional] [default to undefined]
**monthlyPieChart** | [**PieChartDataUiDTO**](PieChartDataUiDTO.md) |  | [optional] [default to undefined]
**yearlyPieChart** | [**PieChartDataUiDTO**](PieChartDataUiDTO.md) |  | [optional] [default to undefined]
**categories** | [**Array&lt;CategoryRepDTO&gt;**](CategoryRepDTO.md) |  | [optional] [default to undefined]
**barChartData** | [**Array&lt;BarChartDataPairUiDTO&gt;**](BarChartDataPairUiDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DashboardDataResponseUiDTO } from './api';

const instance: DashboardDataResponseUiDTO = {
    expenses,
    weeklyPieChart,
    monthlyPieChart,
    yearlyPieChart,
    categories,
    barChartData,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
