package com.bff.bff.security;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// Slows down password guessing on the login and on the settings that ask for the password. Wrong
// passwords are counted per key (the client address plus the login or the account); once a key
// reaches its limit, it gets 429 until 15 minutes have passed since its first failure. Kept in
// memory, so it starts over when the bff restarts, which is enough for a single instance.
@Component
public class FailedAttemptLimiter {
    public static final int MAX_WRONG_PASSWORDS = 5;
    public static final int MAX_FAILED_LOGINS_PER_ADDRESS = 20;
    static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int CLEANUP_THRESHOLD = 10_000;

    private final Map<String, Failures> failures = new ConcurrentHashMap<>();
    private final Clock clock;

    public FailedAttemptLimiter() {
        this(Clock.systemUTC());
    }

    FailedAttemptLimiter(Clock clock) {
        this.clock = clock;
    }

    public void assertNotBlocked(String key, int maxFailures) {
        var current = failures.get(key);
        if (current != null && !current.expired(clock.instant()) && current.count() >= maxFailures) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS, "Too many failed attempts, try again later");
        }
    }

    public void recordFailure(String key) {
        var now = clock.instant();
        failures.compute(
                key,
                (k, current) ->
                        current == null || current.expired(now)
                                ? new Failures(now, 1)
                                : new Failures(current.since(), current.count() + 1));
        if (failures.size() > CLEANUP_THRESHOLD) {
            failures.values().removeIf(f -> f.expired(now));
        }
    }

    public void reset(String key) {
        failures.remove(key);
    }

    private record Failures(Instant since, int count) {
        boolean expired(Instant now) {
            return !now.isBefore(since.plus(WINDOW));
        }
    }
}
