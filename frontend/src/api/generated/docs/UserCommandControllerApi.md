# UserCommandControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUser**](#createuser) | **POST** /api/bff/users | |

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

