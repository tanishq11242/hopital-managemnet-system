package com.healthcare.login.service;

import com.healthcare.login.model.LoginResponse;
import com.healthcare.login.model.Role;
import com.healthcare.login.model.User;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service handling authentication logic for all user roles.
 * Uses in-memory user storage for demonstration purposes.
 */
@Service
public class AuthService {

    private final List<User> users = new ArrayList<>();

    @PostConstruct
    public void initUsers() {
        // Pre-configured demo users for each role
        users.add(new User(1L, "doctor", "doctor123", "Dr. Sarah Johnson", "sarah.johnson@hospital.com", Role.DOCTOR));
        users.add(new User(2L, "dr.smith", "smith456", "Dr. James Smith", "james.smith@hospital.com", Role.DOCTOR));
        users.add(new User(3L, "admin", "admin123", "Alex Thompson", "alex.thompson@hospital.com", Role.ADMIN));
        users.add(new User(4L, "sysadmin", "sys456", "Morgan Lee", "morgan.lee@hospital.com", Role.ADMIN));
        users.add(new User(5L, "patient", "patient123", "Emily Davis", "emily.davis@email.com", Role.PATIENT));
        users.add(new User(6L, "john.doe", "john456", "John Doe", "john.doe@email.com", Role.PATIENT));
    }

    /**
     * Authenticate a user with the given credentials and role.
     *
     * @param username the username
     * @param password the password
     * @param roleStr  the role string (DOCTOR, ADMIN, PATIENT)
     * @return LoginResponse indicating success or failure
     */
    public LoginResponse authenticate(String username, String password, String roleStr) {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            return LoginResponse.failure("Username is required");
        }
        if (password == null || password.trim().isEmpty()) {
            return LoginResponse.failure("Password is required");
        }
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return LoginResponse.failure("Please select a role before logging in");
        }

        // Parse role
        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return LoginResponse.failure("Invalid role selected");
        }

        // Find matching user
        Optional<User> matchedUser = users.stream()
                .filter(u -> u.getUsername().equalsIgnoreCase(username.trim()))
                .filter(u -> u.getPassword().equals(password))
                .filter(u -> u.getRole() == role)
                .findFirst();

        if (matchedUser.isPresent()) {
            User user = matchedUser.get();
            String redirectUrl = getRedirectUrl(role);
            return LoginResponse.success(role.getDisplayName(), user.getFullName(), redirectUrl);
        }

        // Provide specific error messages
        Optional<User> userByName = users.stream()
                .filter(u -> u.getUsername().equalsIgnoreCase(username.trim()))
                .findFirst();

        if (userByName.isEmpty()) {
            return LoginResponse.failure("No account found with this username");
        }

        Optional<User> userWithCorrectPassword = users.stream()
                .filter(u -> u.getUsername().equalsIgnoreCase(username.trim()))
                .filter(u -> u.getPassword().equals(password))
                .findFirst();

        if (userWithCorrectPassword.isEmpty()) {
            return LoginResponse.failure("Incorrect password. Please try again");
        }

        return LoginResponse.failure("This account does not have " + role.getDisplayName() + " access. Please select the correct role.");
    }

    /**
     * Get the redirect URL based on the user's role.
     */
    private String getRedirectUrl(Role role) {
        return switch (role) {
            case DOCTOR -> "/dashboard/doctor";
            case ADMIN -> "/dashboard/admin";
            case PATIENT -> "/dashboard/patient";
        };
    }

    /**
     * Get all available demo credentials (for display purposes).
     */
    public List<User> getDemoUsers() {
        return users;
    }
}
