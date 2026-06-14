package com.healthcare.login.model;

/**
 * DTO for login responses sent to the frontend.
 */
public class LoginResponse {

    private boolean success;
    private String message;
    private String role;
    private String fullName;
    private String redirectUrl;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message, String role, String fullName, String redirectUrl) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.fullName = fullName;
        this.redirectUrl = redirectUrl;
    }

    // Static factory methods
    public static LoginResponse success(String role, String fullName, String redirectUrl) {
        return new LoginResponse(true, "Login successful! Welcome, " + fullName, role, fullName, redirectUrl);
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(false, message, null, null, null);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
