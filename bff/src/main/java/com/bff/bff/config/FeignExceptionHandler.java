package com.bff.bff.config;

import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Passes client errors from the downstream services (400, 403, 404, 409...) through to the UI
// instead of turning every one of them into a 500.
@Slf4j
@RestControllerAdvice
public class FeignExceptionHandler {

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> handleFeignException(FeignException ex) {
        HttpStatus status = HttpStatus.resolve(ex.status());
        if (status == null || !status.is4xxClientError()) {
            log.error("Downstream service error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Downstream service error");
        }
        return ResponseEntity.status(status).body(ex.contentUTF8());
    }
}
