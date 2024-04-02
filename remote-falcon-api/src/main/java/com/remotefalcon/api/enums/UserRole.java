package com.remotefalcon.api.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum UserRole {
    USER("user"),
    ADMIN("admin");

    private final String userRole;
}
