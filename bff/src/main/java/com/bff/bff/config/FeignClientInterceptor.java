package com.bff.bff.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String USER_ID_HEADER = "X-User-Id";

    @Override
    public void apply(RequestTemplate requestTemplate) {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
            if (authorizationHeader != null) {
                requestTemplate.header(AUTHORIZATION_HEADER, authorizationHeader);
            }
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            UUID userId = (UUID) authentication.getPrincipal();
            requestTemplate.header(USER_ID_HEADER, userId.toString());
        }
    }
}
