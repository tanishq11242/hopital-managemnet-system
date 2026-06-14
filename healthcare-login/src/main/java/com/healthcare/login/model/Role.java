package com.healthcare.login.model;

/**
 * Enum representing the different user roles in the healthcare system.
 */
public enum Role {
    DOCTOR("Doctor", "Medical Professional", "Access patient records, manage appointments, write prescriptions"),
    ADMIN("Admin", "System Administrator", "Manage users, system settings, reports and analytics"),
    PATIENT("Patient", "Healthcare Patient", "View medical records, book appointments, access prescriptions");

    private final String displayName;
    private final String subtitle;
    private final String description;

    Role(String displayName, String subtitle, String description) {
        this.displayName = displayName;
        this.subtitle = subtitle;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public String getDescription() {
        return description;
    }
}
