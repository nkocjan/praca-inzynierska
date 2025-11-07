# BudgetCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBudget**](#createbudget) | **POST** /api/bff/budgets | |
|[**deleteBudget**](#deletebudget) | **DELETE** /api/bff/budgets/{id} | |
|[**setDefaultBudget**](#setdefaultbudget) | **POST** /api/bff/budgets/set-default | |

# **createBudget**
> BudgetUiDTO createBudget(budgetCreateRequestUiDTO)


### Example

```typescript
import {
    BudgetCommandControllerApi,
    Configuration,
    BudgetCreateRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetCommandControllerApi(configuration);

let budgetCreateRequestUiDTO: BudgetCreateRequestUiDTO; //

const { status, data } = await apiInstance.createBudget(
    budgetCreateRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **budgetCreateRequestUiDTO** | **BudgetCreateRequestUiDTO**|  | |


### Return type

**BudgetUiDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteBudget**
> deleteBudget()


### Example

```typescript
import {
    BudgetCommandControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetCommandControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteBudget(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setDefaultBudget**
> setDefaultBudget(setDefaultBudgetsRequestUiDTO)


### Example

```typescript
import {
    BudgetCommandControllerApi,
    Configuration,
    SetDefaultBudgetsRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetCommandControllerApi(configuration);

let setDefaultBudgetsRequestUiDTO: SetDefaultBudgetsRequestUiDTO; //

const { status, data } = await apiInstance.setDefaultBudget(
    setDefaultBudgetsRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setDefaultBudgetsRequestUiDTO** | **SetDefaultBudgetsRequestUiDTO**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

