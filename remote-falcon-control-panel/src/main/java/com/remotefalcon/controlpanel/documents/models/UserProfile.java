package com.remotefalcon.controlpanel.documents.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfile {
    private String firstName;
    private String lastName;
    private String facebookUrl;
    private String youtubeUrl;
}
