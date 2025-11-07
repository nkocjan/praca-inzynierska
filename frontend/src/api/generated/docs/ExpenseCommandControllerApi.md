# ExpenseCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createExpense**](#createexpense) | **POST** /api/bff/expenses | |
|[**deleteExpense**](#deleteexpense) | **DELETE** /api/bff/expenses/{expenseId} | |
|[**setAsPlanned**](#setasplanned) | **PUT** /api/bff/expenses/{expenseId}/planned | |
|[**updateExpense**](#updateexpense) | **PUT** /api/bff/expenses/{expenseId} | |

# **createExpense**
> ExpenseUiDTO createExpense(createExpenseRequestUiDTO)


### Example

```typescript
import {
    ExpenseCommandControllerApi,
    Configuration,
    CreateExpenseRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseCommandControllerApi(configuration);

let createExpenseRequestUiDTO: CreateExpenseRequestUiDTO; //

const { status, data } = await apiInstance.createExpense(
    createExpenseRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createExpenseRequestUiDTO** | **CreateExpenseRequestUiDTO**|  | |


### Return type

**ExpenseUiDTO**

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

# **deleteExpense**
> deleteExpense()


### Example

```typescript
import {
    ExpenseCommandControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseCommandControllerApi(configuration);

let expenseId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteExpense(
    expenseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **expenseId** | [**string**] |  | defaults to undefined|


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

# **setAsPlanned**
> ExpenseUiDTO setAsPlanned()


### Example

```typescript
import {
    ExpenseCommandControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseCommandControllerApi(configuration);

let expenseId: string; // (default to undefined)
let isPlanned: boolean; // (default to undefined)

const { status, data } = await apiInstance.setAsPlanned(
    expenseId,
    isPlanned
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **expenseId** | [**string**] |  | defaults to undefined|
| **isPlanned** | [**boolean**] |  | defaults to undefined|


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

# **updateExpense**
> ExpenseUiDTO updateExpense(updateExpenseRequestUiDTO)


### Example

```typescript
import {
    ExpenseCommandControllerApi,
    Configuration,
    UpdateExpenseRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpenseCommandControllerApi(configuration);

let expenseId: string; // (default to undefined)
let updateExpenseRequestUiDTO: UpdateExpenseRequestUiDTO; //

const { status, data } = await apiInstance.updateExpense(
    expenseId,
    updateExpenseRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateExpenseRequestUiDTO** | **UpdateExpenseRequestUiDTO**|  | |
| **expenseId** | [**string**] |  | defaults to undefined|


### Return type

**ExpenseUiDTO**

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

