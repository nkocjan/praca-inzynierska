# UserCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activateAccount**](#activateaccount) | **PUT** /api/bff/users/{id}/activate | |
|[**changePassword**](#changepassword) | **PUT** /api/bff/users/{id}/password | |
|[**createUser**](#createuser) | **POST** /api/bff/users | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/bff/users/{id} | |
|[**setPremium**](#setpremium) | **PUT** /api/bff/users/{id}/premium | |
|[**updateUser**](#updateuser) | **PUT** /api/bff/users/{id} | |

# **activateAccount**
> UserUiDTO activateAccount(activateAccountRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ActivateAccountRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)
let activateAccountRequestDTO: ActivateAccountRequestDTO; //

const { status, data } = await apiInstance.activateAccount(
    id,
    activateAccountRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **activateAccountRequestDTO** | **ActivateAccountRequestDTO**|  | |
| **id** | [**string**] |  | defaults to undefined|


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

# **changePassword**
> changePassword(changePasswordRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    ChangePasswordRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)
let changePasswordRequestDTO: ChangePasswordRequestDTO; //

const { status, data } = await apiInstance.changePassword(
    id,
    changePasswordRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordRequestDTO** | **ChangePasswordRequestDTO**|  | |
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

# **deleteUser**
> deleteUser()


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setPremium**
> UserUiDTO setPremium(setPremiumRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    SetPremiumRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)
let setPremiumRequestDTO: SetPremiumRequestDTO; //

const { status, data } = await apiInstance.setPremium(
    id,
    setPremiumRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setPremiumRequestDTO** | **SetPremiumRequestDTO**|  | |
| **id** | [**string**] |  | defaults to undefined|


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

# **updateUser**
> UserUiDTO updateUser(userUpdateRequestDTO)


### Example

```typescript
import {
    UserCommandControllerApi,
    Configuration,
    UserUpdateRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCommandControllerApi(configuration);

let id: string; // (default to undefined)
let userUpdateRequestDTO: UserUpdateRequestDTO; //

const { status, data } = await apiInstance.updateUser(
    id,
    userUpdateRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateRequestDTO** | **UserUpdateRequestDTO**|  | |
| **id** | [**string**] |  | defaults to undefined|


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

