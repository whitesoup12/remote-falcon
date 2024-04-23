package com.remotefalcon.library.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ShowRole {
    USER("user"),
    ADMIN("admin");

    private final String userRole;
}
