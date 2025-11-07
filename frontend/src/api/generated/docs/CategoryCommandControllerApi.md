# CategoryCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCategory**](#createcategory) | **POST** /api/bff/categories | |
|[**deleteCategory**](#deletecategory) | **DELETE** /api/bff/categories/{id} | |
|[**updateCategory**](#updatecategory) | **PUT** /api/bff/categories/{categoryId} | |

# **createCategory**
> CategoryUiDTO createCategory(categoryCreateRequestUiDTO)


### Example

```typescript
import {
    CategoryCommandControllerApi,
    Configuration,
    CategoryCreateRequestUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryCommandControllerApi(configuration);

let categoryCreateRequestUiDTO: CategoryCreateRequestUiDTO; //

const { status, data } = await apiInstance.createCategory(
    categoryCreateRequestUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryCreateRequestUiDTO** | **CategoryCreateRequestUiDTO**|  | |


### Return type

**CategoryUiDTO**

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

# **deleteCategory**
> deleteCategory()


### Example

```typescript
import {
    CategoryCommandControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryCommandControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteCategory(
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

# **updateCategory**
> updateCategory(updateCategoryUiDTO)


### Example

```typescript
import {
    CategoryCommandControllerApi,
    Configuration,
    UpdateCategoryUiDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryCommandControllerApi(configuration);

let categoryId: string; // (default to undefined)
let updateCategoryUiDTO: UpdateCategoryUiDTO; //

const { status, data } = await apiInstance.updateCategory(
    categoryId,
    updateCategoryUiDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCategoryUiDTO** | **UpdateCategoryUiDTO**|  | |
| **categoryId** | [**string**] |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

