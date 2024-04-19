package com.remotefalcon.controlpanel.documents.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Page {
    private String name;
    private Boolean active;
    private String html;
}
