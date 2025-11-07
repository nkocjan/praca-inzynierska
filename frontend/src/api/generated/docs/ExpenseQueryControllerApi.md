# ExpenseQueryControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getDashboardData**](#getdashboarddata) | **GET** /api/bff/expenses/dashboard | |
|[**getExpenseById**](#getexpensebyid) | **GET** /api/bff/expenses/{expenseId} | |
|[**searchExpenses**](#searchexpenses) | **POST** /api/bff/expenses/search | |

# **getDashboardData**
> DashboardDataResponseUiDTO getDashboardData()


### Example

```typescript
import {
    ExpenseQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseQueryControllerApi(configuration);

const { status, data } = await apiInstance.getDashboardData();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DashboardDataResponseUiDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getExpenseById**
> ExpenseUiDTO getExpenseById()


### Example

```typescript
import {
    ExpenseQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseQueryControllerApi(configuration);

let expenseId: string; // (default to undefined)

const { status, data } = await apiInstance.getExpenseById(
    expenseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **expenseId** | [**string**] |  | defaults to undefined|


### Return type

**ExpenseUiDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchExpenses**
> PageExpenseUiDTO searchExpenses(expenseSearchRequestUiDTO)


### Example

```typescript
import {
    ExpenseQueryControllerApi,
    Configuration,
    Pageable,
    ExpenseSearchRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseQueryControllerApi(configuration);

let pageable: Pageable; // (default to undefined)
let expenseSearchRequestUiDTO: ExpenseSearchRequestUiDTO; //

const { status, data } = await apiInstance.searchExpenses(
    pageable,
    expenseSearchRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **expenseSearchRequestUiDTO** | **ExpenseSearchRequestUiDTO**|  | |
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageExpenseUiDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

