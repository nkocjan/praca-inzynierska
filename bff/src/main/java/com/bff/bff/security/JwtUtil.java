package com.bff.bff.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "jwt_secret_key";

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        return UUID.fromString((String) claims.get("userId"));
    }
}
