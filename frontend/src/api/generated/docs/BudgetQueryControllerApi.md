# BudgetQueryControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllBudgets**](#getallbudgets) | **GET** /api/bff/budgets | |
|[**getBudgetById**](#getbudgetbyid) | **GET** /api/bff/budgets/{id} | |
|[**getDefaultBudgets**](#getdefaultbudgets) | **GET** /api/bff/budgets/get-defaults/{categoryId} | |
|[**searchBudgets**](#searchbudgets) | **POST** /api/bff/budgets/search | |

# **getAllBudgets**
> Array<BudgetDTO> getAllBudgets()


### Example

```typescript
import {
    BudgetQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetQueryControllerApi(configuration);

const { status, data } = await apiInstance.getAllBudgets();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<BudgetDTO>**

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

# **getBudgetById**
> BudgetDTO getBudgetById()


### Example

```typescript
import {
    BudgetQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetQueryControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getBudgetById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BudgetDTO**

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

# **getDefaultBudgets**
> GetDefaultBudgetsResponseUiDTO getDefaultBudgets()


### Example

```typescript
import {
    BudgetQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetQueryControllerApi(configuration);

let categoryId: string; // (default to undefined)

const { status, data } = await apiInstance.getDefaultBudgets(
    categoryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryId** | [**string**] |  | defaults to undefined|


### Return type

**GetDefaultBudgetsResponseUiDTO**

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

# **searchBudgets**
> PageBudgetDTO searchBudgets(budgetSearchRequestDTO)


### Example

```typescript
import {
    BudgetQueryControllerApi,
    Configuration,
    Pageable,
    BudgetSearchRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new BudgetQueryControllerApi(configuration);

let pageable: Pageable; // (default to undefined)
let budgetSearchRequestDTO: BudgetSearchRequestDTO; //

const { status, data } = await apiInstance.searchBudgets(
    pageable,
    budgetSearchRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **budgetSearchRequestDTO** | **BudgetSearchRequestDTO**|  | |
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageBudgetDTO**

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

