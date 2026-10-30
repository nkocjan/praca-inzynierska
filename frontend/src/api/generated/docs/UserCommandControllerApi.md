# UserCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changeEmailMe**](#changeemailme) | **PUT** /api/bff/users/me/email | |
|[**changeNicknameMe**](#changenicknameme) | **PUT** /api/bff/users/me/nickname | |
|[**changePasswordMe**](#changepasswordme) | **PUT** /api/bff/users/me/password | |
|[**createUser**](#createuser) | **POST** /api/bff/users | |
|[**deleteMe**](#deleteme) | **POST** /api/bff/users/me/delete | |
|[**resetAccountDataMe**](#resetaccountdatame) | **POST** /api/bff/users/me/reset-data | |
|[**resetSelectedCategories**](#resetselectedcategories) | **POST** /api/bff/users/{id}/categories/reset | |
|[**resetSelectedCategoriesMe**](#resetselectedcategoriesme) | **POST** /api/bff/users/me/categories/reset | |

# **changeEmailMe**
> UserUiDTO changeEmailMe(changeEmailUiRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ChangeEmailUiRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let changeEmailUiRequestDTO: ChangeEmailUiRequestDTO; //

const { status, data } = await apiInstance.changeEmailMe(
    changeEmailUiRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changeEmailUiRequestDTO** | **ChangeEmailUiRequestDTO**|  | |


### Return type

**UserUiDTO**

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

# **changeNicknameMe**
> UserUiDTO changeNicknameMe(changeNicknameUiRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ChangeNicknameUiRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let changeNicknameUiRequestDTO: ChangeNicknameUiRequestDTO; //

const { status, data } = await apiInstance.changeNicknameMe(
    changeNicknameUiRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changeNicknameUiRequestDTO** | **ChangeNicknameUiRequestDTO**|  | |


### Return type

**UserUiDTO**

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

# **changePasswordMe**
> changePasswordMe(changePasswordRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ChangePasswordRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let changePasswordRequestDTO: ChangePasswordRequestDTO; //

const { status, data } = await apiInstance.changePasswordMe(
    changePasswordRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordRequestDTO** | **ChangePasswordRequestDTO**|  | |


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

# **createUser**
> UserUiDTO createUser(userCreateRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    UserCreateRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let userCreateRequestDTO: UserCreateRequestDTO; //

const { status, data } = await apiInstance.createUser(
    userCreateRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCreateRequestDTO** | **UserCreateRequestDTO**|  | |


### Return type

**UserUiDTO**

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

# **deleteMe**
> deleteMe(confirmCredentialsRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ConfirmCredentialsRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let confirmCredentialsRequestDTO: ConfirmCredentialsRequestDTO; //

const { status, data } = await apiInstance.deleteMe(
    confirmCredentialsRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **confirmCredentialsRequestDTO** | **ConfirmCredentialsRequestDTO**|  | |


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

# **resetAccountDataMe**
> resetAccountDataMe(confirmCredentialsRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ConfirmCredentialsRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let confirmCredentialsRequestDTO: ConfirmCredentialsRequestDTO; //

const { status, data } = await apiInstance.resetAccountDataMe(
    confirmCredentialsRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **confirmCredentialsRequestDTO** | **ConfirmCredentialsRequestDTO**|  | |


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

# **resetSelectedCategories**
> resetSelectedCategories(resetCategoriesRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ResetCategoriesRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)
let resetCategoriesRequestDTO: ResetCategoriesRequestDTO; //

const { status, data } = await apiInstance.resetSelectedCategories(
    id,
    resetCategoriesRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetCategoriesRequestDTO** | **ResetCategoriesRequestDTO**|  | |
| **id** | [**string**] |  | defaults to undefined|


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

# **resetSelectedCategoriesMe**
> resetSelectedCategoriesMe(resetCategoriesRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ResetCategoriesRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let resetCategoriesRequestDTO: ResetCategoriesRequestDTO; //

const { status, data } = await apiInstance.resetSelectedCategoriesMe(
    resetCategoriesRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetCategoriesRequestDTO** | **ResetCategoriesRequestDTO**|  | |


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

