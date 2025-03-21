package com.SkillSetZone.SkillSetZone.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

public class AdminAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Get authorization header
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Basic ")) {
                // Extract credentials - trim to remove any potential whitespace or newlines
                String base64Credentials = authHeader.substring("Basic ".length()).trim();

                // Handle padding issues that can cause Base64 decoding errors
                // Base64 strings should have length multiple of 4, add padding if needed
                while (base64Credentials.length() % 4 != 0) {
                    base64Credentials += "=";
                }

                byte[] decodedCredentials = Base64.getDecoder().decode(base64Credentials);
                String credentials = new String(decodedCredentials);

                // Split into username and password
                String[] parts = credentials.split(":", 2);
                if (parts.length == 2) {
                    String username = parts[0];
                    String password = parts[1];

                    // Check if admin credentials
                    if ("admin".equals(username) && "admin".equals(password)) {
                        // Create authentication with ADMIN role
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                username, null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));

                        // Set authentication in context
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        } catch (IllegalArgumentException e) {
            // Log the error instead of letting it propagate
            logger.warn("Base64 decoding failed: " + e.getMessage());
            // Continue without authentication
        } catch (Exception e) {
            // Catch any other exceptions to ensure the filter chain continues
            logger.error("Error in authentication filter", e);
        }

        // Always continue the filter chain
        filterChain.doFilter(request, response);
    }
}