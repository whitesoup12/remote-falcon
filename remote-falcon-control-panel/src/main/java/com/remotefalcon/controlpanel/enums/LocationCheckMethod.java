package com.remotefalcon.controlpanel.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum LocationCheckMethod {
    GEO("GEO"),
    CODE("CODE"),
    NONE("NONE");

    private final String locationCheckMethod;
}
