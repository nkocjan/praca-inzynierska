# AuthProxyControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**login**](#login) | **POST** /auth/login | |

# **login**
> string login(authRequestDTO)


### Example

```typescript
import {
    AuthProxyControllerApi,
    Configuration,
    AuthRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthProxyControllerApi(configuration);

let authRequestDTO: AuthRequestDTO; //

const { status, data } = await apiInstance.login(
    authRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authRequestDTO** | **AuthRequestDTO**|  | |


### Return type

**string**

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

