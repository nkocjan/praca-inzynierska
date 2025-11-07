# CategoryQueryControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllCategories**](#getallcategories) | **GET** /api/bff/categories | |
|[**getAllCategoriesForCombo**](#getallcategoriesforcombo) | **GET** /api/bff/categories/combo | |
|[**getCategoryById**](#getcategorybyid) | **GET** /api/bff/categories/{id} | |

# **getAllCategories**
> Array<CategoryUiDTO> getAllCategories()


### Example

```typescript
import {
    CategoryQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryQueryControllerApi(configuration);

const { status, data } = await apiInstance.getAllCategories();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CategoryUiDTO>**

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

# **getAllCategoriesForCombo**
> Array<CategoryUiDTO> getAllCategoriesForCombo()


### Example

```typescript
import {
    CategoryQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryQueryControllerApi(configuration);

const { status, data } = await apiInstance.getAllCategoriesForCombo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CategoryUiDTO>**

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

# **getCategoryById**
> CategoryDTO getCategoryById()


### Example

```typescript
import {
    CategoryQueryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryQueryControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getCategoryById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CategoryDTO**

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

