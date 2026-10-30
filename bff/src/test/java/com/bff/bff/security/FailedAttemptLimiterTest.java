package com.bff.bff.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class FailedAttemptLimiterTest {

    private static final String KEY = "login:203.0.113.7:jan";

    // A clock the test moves by hand.
    private static final class TestClock extends Clock {
        private Instant now = Instant.parse("2026-10-30T10:00:00Z");

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }

    private final TestClock clock = new TestClock();
    private final FailedAttemptLimiter limiter = new FailedAttemptLimiter(clock);

    private void fail(String key, int times) {
        for (int i = 0; i < times; i++) {
            limiter.recordFailure(key);
        }
    }

    @Test
    void allowsFailuresBelowTheLimit() {
        fail(KEY, 4);

        assertDoesNotThrow(() -> limiter.assertNotBlocked(KEY, 5));
    }

    @Test
    void blocksTheKeyAtTheLimitWith429() {
        fail(KEY, 5);

        var ex = assertThrows(ResponseStatusException.class, () -> limiter.assertNotBlocked(KEY, 5));
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
    }

    @Test
    void otherKeysStayOpen() {
        fail(KEY, 5);

        assertDoesNotThrow(() -> limiter.assertNotBlocked("login:203.0.113.8:jan", 5));
    }

    @Test
    void unblocksOnceTheWindowHasPassed() {
        fail(KEY, 5);
        clock.advance(FailedAttemptLimiter.WINDOW.minusSeconds(1));
        assertThrows(ResponseStatusException.class, () -> limiter.assertNotBlocked(KEY, 5));

        clock.advance(Duration.ofSeconds(1));

        assertDoesNotThrow(() -> limiter.assertNotBlocked(KEY, 5));
    }

    @Test
    void theWindowStartsAtTheFirstFailure() {
        fail(KEY, 4);
        clock.advance(FailedAttemptLimiter.WINDOW);
        fail(KEY, 1);

        assertDoesNotThrow(() -> limiter.assertNotBlocked(KEY, 5));
    }

    @Test
    void resetClearsTheCount() {
        fail(KEY, 5);

        limiter.reset(KEY);

        assertDoesNotThrow(() -> limiter.assertNotBlocked(KEY, 5));
    }
}
