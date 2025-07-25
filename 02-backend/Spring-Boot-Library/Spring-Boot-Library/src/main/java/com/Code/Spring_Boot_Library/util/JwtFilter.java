package com.Code.Spring_Boot_Library.util;

import com.Code.Spring_Boot_Library.service.TokenBlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter that intercepts incoming HTTP requests and checks for a valid JWT token in the Authorization header.
 * If the token is valid, it sets the authentication in the Spring Security context.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
            final String token = authHeader.substring(7);

            // Check if the token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                logger.warn("JWT token is blacklisted.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is revoked");
                return;
            }

            // Proceed only if no authentication is already set
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    // Validate token
                    if (jwtUtil.validateToken(token)) {
                        String email = jwtUtil.extractEmail(token);

                        if (email != null) {
                            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                            UsernamePasswordAuthenticationToken authToken =
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails, null, userDetails.getAuthorities());

                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    } else {
                        logger.warn("JWT token is invalid.");
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                        return;
                    }

                } catch (ExpiredJwtException e) {
                    logger.warn("JWT token expired: {}", e.getMessage());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                    return;

                } catch (JwtException e) {
                    logger.error("JWT token is malformed or invalid: {}", e.getMessage());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                    return;

                } catch (Exception e) {
                    logger.error("Unexpected error during JWT processing: {}", e.getMessage());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access");
                    return;
                }
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}



/**
 * Extracts the token from the Authorization header.
 *
 * Validates the token using jwtUtil.validateToken(token).
 *
 * Extracts email from the token.
 *
 * Loads user details via UserDetailsService using email.
 *
 * Creates and sets UsernamePasswordAuthenticationToken into Spring Security context.
 *
 * Continues filter chain.
 */