package com.remotefalcon.api.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum LocationCheckMethod {
    GEO("geo"),
    CODE("code");

    private final String locationCheckMethod;
}
