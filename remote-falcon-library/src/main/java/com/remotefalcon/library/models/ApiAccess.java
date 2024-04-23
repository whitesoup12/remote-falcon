package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiAccess {
    private Boolean apiAccessActive;
    private String apiAccessToken;
    private String apiAccessSecret;
}
