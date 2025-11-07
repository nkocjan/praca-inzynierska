# BudgetUiDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to undefined]
**period** | **string** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**spentAmount** | **number** |  | [optional] [default to undefined]
**periodStart** | **string** |  | [optional] [default to undefined]
**periodEnd** | **string** |  | [optional] [default to undefined]
**category** | [**CategorySimplifiedUiDTO**](CategorySimplifiedUiDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { BudgetUiDTO } from './api';

const instance: BudgetUiDTO = {
    id,
    name,
    description,
    isActive,
    period,
    amount,
    spentAmount,
    periodStart,
    periodEnd,
    category,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
