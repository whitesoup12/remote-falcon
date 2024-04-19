package com.remotefalcon.viewer.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ShowRole {
    USER("user"),
    ADMIN("admin");

    private final String userRole;
}
