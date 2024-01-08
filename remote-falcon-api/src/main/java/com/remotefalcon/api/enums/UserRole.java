package com.remotefalcon.api.enums;

public enum UserRole {
    USER("user"),
    ADMIN("admin");

    public final String userRole;

    private UserRole(String userRole) {
        this.userRole = userRole;
    }
}
